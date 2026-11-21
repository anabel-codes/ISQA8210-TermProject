/* Shared management feedback. Django owns message content and validation; this only presents it. */
(() => {
  'use strict';
  const levels = {
    success: {label:'Success', symbol:'✓', duration:6500},
    error: {label:'Error', symbol:'!', duration:0},
    warning: {label:'Warning', symbol:'!', duration:9000},
    info: {label:'Information', symbol:'i', duration:6500}
  };
  const toast = (message, level = 'info') => {
    const box = document.getElementById('adminToasts');
    if (!box || !message) return;
    const kind = levels[level] ? level : 'info', config = levels[kind];
    const item = document.createElement('div');
    item.className = `admin-toast admin-toast--${kind}`;
    item.setAttribute('role', kind === 'error' || kind === 'warning' ? 'alert' : 'status');
    const icon = document.createElement('span'); icon.className = 'admin-toast-icon';
    icon.textContent = config.symbol; icon.setAttribute('aria-hidden','true');
    const content = document.createElement('div'), title = document.createElement('strong'), text = document.createElement('p');
    title.textContent = config.label; text.textContent = String(message);
    content.append(title, text);
    const close = document.createElement('button'); close.type = 'button'; close.className = 'admin-toast-close';
    close.setAttribute('aria-label', `Dismiss ${config.label.toLowerCase()} notification`); close.textContent = '×';
    item.append(icon, content, close); box.append(item);
    let timer;
    const dismiss = () => { clearTimeout(timer); item.remove(); };
    const resume = () => { clearTimeout(timer); if (config.duration) timer = setTimeout(dismiss,config.duration); };
    close.addEventListener('click',dismiss);
    item.addEventListener('mouseenter',()=>clearTimeout(timer)); item.addEventListener('mouseleave',resume);
    item.addEventListener('focusin',()=>clearTimeout(timer));
    item.addEventListener('focusout',event=>{if(!item.contains(event.relatedTarget)) resume();});
    resume();
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
