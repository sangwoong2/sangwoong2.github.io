/*
 * 화면 아래에서 열리는 JS 실행기.
 *
 * - 사이드바의 JS 버튼(#js-toggle)으로 열고 닫는다.
 * - 입력한 코드는 Web Worker(별도 스레드)에서 실행한다.
 *   무한 반복을 넣어도 화면이 멈추지 않고, 시간이 지나면 중단할 수 있다.
 *   화면(document, window)에는 접근할 수 없다. 언어 기능, Promise, 타이머를 확인하는 용도다.
 * - 코드 색상 표시는 CodeMirror 를 쓴다. 처음 열 때 내려받고, 실패하면 일반 입력창으로 동작한다.
 */
(function () {
  'use strict';

  var OPEN_KEY = 'js-playground-open';
  var CODE_KEY = 'js-playground-code';
  var RUN_LIMIT_MS = 10000;     // 이 시간 안에 끝나지 않으면 중단한다
  var IDLE_LIMIT_MS = 10000;    // 끝난 뒤에도 타이머 콜백이 올 수 있어 이만큼 더 기다린다
  var MAX_LINES = 500;

  var CM_BASE = 'https://cdn.jsdelivr.net/npm/codemirror@5.65.16/';
  var CM_STYLE = CM_BASE + 'lib/codemirror.min.css';
  var CM_SCRIPTS = [
    CM_BASE + 'lib/codemirror.min.js',
    CM_BASE + 'mode/javascript/javascript.min.js',
    CM_BASE + 'addon/edit/matchbrackets.min.js',
    CM_BASE + 'addon/edit/closebrackets.min.js',
  ];

  var DEFAULT_CODE = [
    "const rows = [10, 9, 1, 100];",
    "",
    "console.log(rows.sort());",
    "console.log(rows.sort((a, b) => a - b));",
  ].join('\n');

  var drawer = document.getElementById('js-drawer');
  var toggle = document.getElementById('js-toggle');
  if (!drawer || !toggle) return;

  var code = document.getElementById('js-code');
  var output = document.getElementById('js-output');
  var runButton = document.getElementById('js-run');
  var clearButton = document.getElementById('js-clear');
  var closeButton = document.getElementById('js-close');

  var editor = null;            // CodeMirror 인스턴스. 내려받기 전이나 실패했을 때는 null
  var editorRequested = false;

  function load(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }

  function save(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* 저장소를 쓸 수 없는 환경 */ }
  }

  function getCode() {
    return editor ? editor.getValue() : code.value;
  }

  /* ---------- 코드 색상 표시 (CodeMirror) ---------- */

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = function () { reject(new Error(src)); };
      document.head.appendChild(script);
    });
  }

  function loadEditor() {
    if (editorRequested) return;
    editorRequested = true;

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = CM_STYLE;
    document.head.appendChild(link);

    // 순서대로 내려받는다. 뒤의 파일은 앞의 파일이 만든 CodeMirror 를 쓴다.
    var chain = Promise.resolve();
    CM_SCRIPTS.forEach(function (src) {
      chain = chain.then(function () { return loadScript(src); });
    });

    chain.then(function () {
      editor = window.CodeMirror.fromTextArea(code, {
        mode: 'javascript',
        theme: 'blog',
        lineNumbers: true,
        indentUnit: 4,
        tabSize: 4,
        matchBrackets: true,
        autoCloseBrackets: true,
        extraKeys: {
          'Ctrl-Enter': run,
          'Cmd-Enter': run,
          Tab: function (cm) {
            if (cm.somethingSelected()) cm.indentSelection('add');
            else cm.replaceSelection('    ', 'end');
          },
        },
      });

      editor.on('change', function () {
        save(CODE_KEY, editor.getValue());
      });

      editor.refresh();
    }).catch(function () {
      // 내려받지 못하면 일반 입력창을 그대로 쓴다.
    });
  }

  /* ---------- 열기와 닫기 ---------- */

  function setOpen(open) {
    drawer.hidden = !open;
    document.body.classList.toggle('js-open', open);
    toggle.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    save(OPEN_KEY, open ? '1' : '0');

    if (open) {
      loadEditor();
      if (editor) editor.refresh();
    }
  }

  toggle.addEventListener('click', function () {
    setOpen(drawer.hidden);
  });

  closeButton.addEventListener('click', function () {
    setOpen(false);
  });

  /* ---------- 결과 출력 ---------- */

  var lineCount = 0;

  function clearOutput() {
    output.textContent = '';
    lineCount = 0;
  }

  function print(level, text) {
    if (lineCount === MAX_LINES) {
      level = 'info';
      text = '(출력이 ' + MAX_LINES + '줄을 넘어 생략했습니다.)';
    } else if (lineCount > MAX_LINES) {
      return;
    }
    var line = document.createElement('div');
    line.className = 'js-line js-' + level;
    line.textContent = text;
    output.appendChild(line);
    output.scrollTop = output.scrollHeight;
    lineCount++;
  }

  /* ---------- Worker 안에서 실행되는 코드 ---------- */

  function workerMain() {
    var MAX_DEPTH = 4;
    var MAX_ITEMS = 100;

    function keyText(key) {
      return /^[A-Za-z_$][\w$]*$/.test(key) ? key : "'" + key + "'";
    }

    function format(value, depth, seen, top) {
      if (value === null) return 'null';
      var type = typeof value;
      if (type === 'undefined') return 'undefined';
      if (type === 'string') return top ? value : "'" + value + "'";
      if (type === 'number') return Object.is(value, -0) ? '-0' : String(value);
      if (type === 'boolean') return String(value);
      if (type === 'bigint') return value + 'n';
      if (type === 'symbol') return value.toString();
      if (type === 'function') {
        var source = Function.prototype.toString.call(value);
        var name = value.name || '(이름 없음)';
        return /^class\b/.test(source) ? '[class ' + name + ']' : '[Function: ' + name + ']';
      }
      if (seen.indexOf(value) !== -1) return '[Circular]';
      if (value instanceof Error) return value.name + ': ' + value.message;
      if (value instanceof Promise) return 'Promise { }';
      if (value instanceof Date) return isNaN(value) ? 'Invalid Date' : String(value);
      if (value instanceof RegExp) return String(value);

      var isArray = Array.isArray(value);
      if (depth >= MAX_DEPTH) return isArray ? '[Array]' : '[Object]';
      var next = seen.concat([value]);
      var parts = [];
      var i;

      if (isArray) {
        for (i = 0; i < value.length && i < MAX_ITEMS; i++) {
          parts.push(i in value ? format(value[i], depth + 1, next, false) : '(빈 칸)');
        }
        if (value.length > MAX_ITEMS) parts.push('... ' + (value.length - MAX_ITEMS) + '개 더');
        return parts.length === 0 ? '[]' : '[' + parts.join(', ') + ']';
      }

      if (value instanceof Map) {
        value.forEach(function (v, k) {
          parts.push(format(k, depth + 1, next, false) + ' => ' + format(v, depth + 1, next, false));
        });
        return 'Map(' + value.size + ') {' + (parts.length ? ' ' + parts.join(', ') + ' ' : '') + '}';
      }

      if (value instanceof Set) {
        value.forEach(function (v) {
          parts.push(format(v, depth + 1, next, false));
        });
        return 'Set(' + value.size + ') {' + (parts.length ? ' ' + parts.join(', ') + ' ' : '') + '}';
      }

      var keys = Object.keys(value);
      for (i = 0; i < keys.length && i < MAX_ITEMS; i++) {
        parts.push(keyText(keys[i]) + ': ' + format(value[keys[i]], depth + 1, next, false));
      }
      if (keys.length > MAX_ITEMS) parts.push('... ' + (keys.length - MAX_ITEMS) + '개 더');

      var proto = Object.getPrototypeOf(value);
      var className = proto && proto.constructor && proto.constructor.name;
      var prefix = className && className !== 'Object' ? className + ' ' : '';
      return prefix + (parts.length === 0 ? '{}' : '{ ' + parts.join(', ') + ' }');
    }

    function describe(error) {
      return error instanceof Error ? error.name + ': ' + error.message : format(error, 0, [], true);
    }

    function send(level, args) {
      var texts = [];
      for (var i = 0; i < args.length; i++) texts.push(format(args[i], 0, [], true));
      self.postMessage({ type: 'log', level: level, text: texts.join(' ') });
    }

    function bind(method, level) {
      console[method] = function () {
        send(level, Array.prototype.slice.call(arguments));
      };
    }

    bind('log', 'log');
    bind('info', 'log');
    bind('debug', 'log');
    bind('table', 'log');
    bind('warn', 'warn');
    bind('error', 'error');

    self.addEventListener('unhandledrejection', function (e) {
      e.preventDefault();
      send('error', ['Uncaught (in promise) ' + describe(e.reason)]);
    });

    self.onmessage = function (e) {
      var AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      var run;

      try {
        run = new AsyncFunction(e.data.code);
      } catch (error) {
        send('error', [describe(error)]);
        self.postMessage({ type: 'done' });
        return;
      }

      run().then(
        function () { self.postMessage({ type: 'done' }); },
        function (error) {
          send('error', ['Uncaught ' + describe(error)]);
          self.postMessage({ type: 'done' });
        }
      );
    };
  }

  /* ---------- 실행 ---------- */

  var workerUrl = null;
  var worker = null;
  var timer = null;

  function stop() {
    if (timer) { clearTimeout(timer); timer = null; }
    if (worker) { worker.terminate(); worker = null; }
  }

  function run() {
    var source = getCode();

    stop();
    clearOutput();
    save(CODE_KEY, source);

    if (!window.Worker) {
      print('error', '이 브라우저에서는 실행할 수 없습니다.');
      return;
    }

    if (!workerUrl) {
      var workerSource = '(' + workerMain.toString() + ')();';
      workerUrl = URL.createObjectURL(new Blob([workerSource], { type: 'application/javascript' }));
    }

    var current = new Worker(workerUrl);
    var printed = false;
    worker = current;

    current.onmessage = function (e) {
      if (worker !== current) return;

      if (e.data.type === 'log') {
        printed = true;
        print(e.data.level, e.data.text);
        return;
      }

      // 코드의 실행이 끝났다. 타이머 콜백이 뒤늦게 출력할 수 있으므로 잠시 더 둔다.
      if (!printed) print('info', '(출력이 없습니다. console.log 로 값을 출력하세요.)');
      clearTimeout(timer);
      timer = setTimeout(function () {
        if (worker === current) stop();
      }, IDLE_LIMIT_MS);
    };

    // 타이머 콜백처럼 나중에 실행된 코드에서 잡히지 않은 에러
    current.onerror = function (e) {
      if (worker !== current) return;
      e.preventDefault();
      printed = true;
      print('error', e.message || '에러가 발생했습니다.');
    };

    timer = setTimeout(function () {
      if (worker !== current) return;
      stop();
      print('error', (RUN_LIMIT_MS / 1000) + '초 안에 끝나지 않아 중단했습니다.');
    }, RUN_LIMIT_MS);

    current.postMessage({ code: source });
  }

  runButton.addEventListener('click', run);

  clearButton.addEventListener('click', function () {
    stop();
    clearOutput();
  });

  /* ---------- 일반 입력창 (CodeMirror 를 내려받기 전이나 실패했을 때) ---------- */

  code.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      run();
      return;
    }

    // Tab 은 다음 요소로 넘어가지 않고 들여쓰기를 넣는다
    if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
      e.preventDefault();
      var start = code.selectionStart;
      var end = code.selectionEnd;
      code.value = code.value.slice(0, start) + '    ' + code.value.slice(end);
      code.selectionStart = code.selectionEnd = start + 4;
    }
  });

  code.addEventListener('input', function () {
    save(CODE_KEY, code.value);
  });

  /* ---------- 처음 상태 ---------- */

  var savedCode = load(CODE_KEY);
  code.value = savedCode === null ? DEFAULT_CODE : savedCode;
  setOpen(load(OPEN_KEY) === '1');
})();
