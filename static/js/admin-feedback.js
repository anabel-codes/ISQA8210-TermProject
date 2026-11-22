/* Shared management feedback. Django owns message content and validation; this only presents it. */
(() => {
  'use strict';
  const levels = {
    success: {label:'Success', symbol:'✓', duration:1500},
    error: {label:'Error', symbol:'!', duration:2500},
    danger: {label:'Danger', symbol:'!', duration:2500},
    warning: {label:'Warning', symbol:'!', duration:3000},
    info: {label:'Information', symbol:'i', duration:4000},
    debug: {label:'Debug', symbol:'i', duration:4000}
  };
  const toast = (message, level = 'info') => {
    const box = document.getElementById('adminToasts');
    if (!box || !message) return;
    const kind = levels[level] ? level : 'info', config = levels[kind];
    const item = document.createElement('div');
    item.className = `admin-toast admin-toast--${kind}`;
    item.setAttribute('role', ['error','danger','warning'].includes(kind) ? 'alert' : 'status');
    const icon = document.createElement('span'); icon.className = 'admin-toast-icon';
    icon.textContent = config.symbol; icon.setAttribute('aria-hidden','true');
    const content = document.createElement('div'), title = document.createElement('strong'), text = document.createElement('p');
    title.textContent = config.label; text.textContent = String(message);
    const heading = document.createElement('div'); heading.className = 'admin-toast-heading';
    const countdown = document.createElement('span'); countdown.className = 'admin-toast-countdown';
    countdown.setAttribute('aria-hidden','true');
    heading.append(title, countdown); content.append(heading, text);
    const close = document.createElement('button'); close.type = 'button'; close.className = 'admin-toast-close';
    close.setAttribute('aria-label', `Dismiss ${config.label.toLowerCase()} notification`); close.textContent = '×';
    const track = document.createElement('div'); track.className = 'admin-toast-track';
    track.setAttribute('aria-hidden','true');
    const progress = document.createElement('span'); progress.className = 'admin-toast-progress';
    progress.style.animationDuration = `${config.duration}ms`; track.append(progress);
    item.append(icon, content, close, track); box.append(item);
    const deadline = performance.now() + config.duration;
    let timer, ticker;
    const dismiss = () => { clearTimeout(timer); clearTimeout(ticker); item.remove(); };
    const tick = () => {
      countdown.textContent = `${(Math.ceil(Math.max(0,deadline-performance.now())/100)/10).toFixed(1)}s`;
      ticker = setTimeout(tick,100);
    };
    close.addEventListener('click',dismiss);
    // Each toast has its own fixed deadline, including while hovered or focused.
    tick(); timer = setTimeout(dismiss,config.duration);
  };
  const confirm = async ({title,text,ok='Confirm',danger=false}) => {
    if (!window.Swal) return window.confirm(`${title}\n\n${text}`);
    // Wait for focus restoration before another action can open a dialog.
    let finishClosing;
    const closed = new Promise(resolve => { finishClosing = resolve; });
    const result = await Swal.fire({
      titleText:title, text, icon:danger?'warning':'question', showCancelButton:true,
      confirmButtonText:ok, cancelButtonText:'Keep working', reverseButtons:true,
      focusCancel:true, returnFocus:true, buttonsStyling:false, didClose:()=>finishClosing(),
      customClass:{popup:'ck-confirm',title:'ck-confirm-title',htmlContainer:'ck-confirm-text',
        confirmButton:`pbtn ${danger?'danger':'acc'}`,cancelButton:'pbtn ghost'},
      showClass:{popup:matchMedia('(prefers-reduced-motion: reduce)').matches?'':'swal2-show'},
      hideClass:{popup:matchMedia('(prefers-reduced-motion: reduce)').matches?'':'swal2-hide'}
    });
    await closed;
    return result.isConfirmed;
  };
  window.CKFeedback = Object.freeze({toast,confirm});
  document.documentElement.classList.add('js-feedback');
  document.querySelectorAll('[data-flash]').forEach((message,index)=>{
    setTimeout(()=>toast(message.textContent,message.dataset.level),index*200);
  });
})();
