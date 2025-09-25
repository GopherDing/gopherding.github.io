// 等 DOM 加载完再执行，避免找不到元素
document.addEventListener("DOMContentLoaded", () => {
  // 1. 找到副标题元素
  const subtitle = document.querySelector(".profile-subtitle");
  if (!subtitle) return; // 没找到元素就退出，避免报错

  // 2. 读取 data-quotes 里的句子列表
  const quotes = JSON.parse(subtitle.dataset.quotes || "[]");
  if (quotes.length === 0) return; // 没句子也退出

  // 3. 动画参数（可自己调速度）
  const typingSpeed = 100;       // 打字速度（毫秒/字）
  const deletingSpeed = 25;      // 删除速度
  const pauseAfterTyping = 2000; // 打完停顿
  const pauseAfterDeleting = 500;// 删除完停顿

  // 4. 状态变量
  let currentQuoteIndex = Math.floor(Math.random() * quotes.length); // 随机开始第一句
  let currentText = "";         // 当前显示的文字
  let charIndex = 0;            // 当前处理的字符索引
  let isDeleting = false;       // 是否在删除状态

  // 5. 核心打字函数
  function typeWriter() {
    const currentQuote = quotes[currentQuoteIndex];

    if (isDeleting) {
      // 删除阶段：逐字减少
      currentText = currentQuote.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // 打字阶段：逐字增加
      currentText = currentQuote.substring(0, charIndex + 1);
      charIndex++;
    }

    // 更新副标题内容
    subtitle.textContent = currentText;

    // 切换状态/句子
    if (!isDeleting && charIndex === currentQuote.length) {
      // 打完一句，准备删除
      isDeleting = true;
      setTimeout(typeWriter, pauseAfterTyping);
    } else if (isDeleting && charIndex === 0) {
      // 删除完，切换下一句（避免重复）
      isDeleting = false;
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * quotes.length);
      } while (newIndex === currentQuoteIndex);
      currentQuoteIndex = newIndex;
      setTimeout(typeWriter, pauseAfterDeleting);
    } else {
      // 继续打字/删除
      setTimeout(typeWriter, isDeleting ? deletingSpeed : typingSpeed);
    }
  }

  // 6. 启动动画
  typeWriter();
});