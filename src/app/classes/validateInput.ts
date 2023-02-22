export class ValidateInput {
  alphaOnly(e: any) {
    var regex = new RegExp(`[0-9!@#$%^&*()+=?,<>:;".{}/]`);
    if (e.type === 'keydown') {
      if (regex.test(e.key)) {
        e.preventDefault();
      }
    }
    else {
      let pastedText = e.clipboardData?.getData('text');
      if (regex.test(pastedText)) {
        e.preventDefault();
      }
    }
  }

  digitsOnly(e: any) {
    var regex = new RegExp("^[0-9]+$");
    if (e.type === 'keydown') {
      if (!regex.test(e.key) && e.keyCode !== 8 && e.key != 'Tab' && !((e.ctrlKey == true || e.metaKey == true) && (e.key === 'v' || e.key === 'a' || e.key === 'x' || e.key === 'c')) && (e.code != 'ArrowLeft' || e.code != 'ArrowRight')) {
        e.preventDefault();
      }
    }
    else {
      let pastedText = e.clipboardData?.getData('text');
      if (!regex.test(pastedText)) {
        e.preventDefault();
      }
    }
  }

  dateCheck(e: any) {
    var regex = new RegExp("^[0-9/]+$");
    if (e.type === 'keydown') {
      if (!regex.test(e.key) && e.keyCode !== 8 && e.key != 'Tab' && !((e.ctrlKey == true || e.metaKey == true) && (e.key === 'v' || e.key === 'a' || e.key === 'x' || e.key === 'c')) && (e.code != 'ArrowLeft' || e.code != 'ArrowRight')) {
        e.preventDefault();
      }
    }
    else {
      let pastedText = e.clipboardData?.getData('text');
      if (!regex.test(pastedText)) {
        e.preventDefault();
      }
    }
  }
}
