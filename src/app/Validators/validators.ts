import { AbstractControl, FormControl } from '@angular/forms'
import * as moment from 'moment';

export function validateOTP(control: AbstractControl) {
  let otp_REGEXP = /^[0-9]*$/;
  return otp_REGEXP.test(control.value) ? null : {
    digitsOnly: true
  };
}

export function confirmationPassword(control: AbstractControl) {
  return control.value.confirmPassword && control.value.confirmPassword !== control.value.password ? {
    passwordNotMatch: true
  } : null;
}

export function ssnConfirmationCheck(control: AbstractControl) {
  return control.value.ssn_confirmation != control.value.ssn ? {
    ssnNotMatch: true
  } : null;
}

export function dobCheck(control: AbstractControl) {
  return (!!control.value && !moment(control.value).isValid()) ? {
    notADate: true
  } : moment(control.value) < moment('1/1/1910', "DD-MM-YYYY") ? {
    invalidDate: true
  } : moment().diff(moment(control.value), 'years') < 15 ? {
    dobMinAgeError: true
  } : null;
}

export function releaseDateCheck(control: AbstractControl) {
  return !!control.value.release_date && control.value.release_date < control.value.conviction_date ? {
    releaseDateError: true
  } : null;
}

export function unemploymentStopCheck(control: AbstractControl) {
  return control.value.unemployment_stop_date < control.value.unemployment_start_date ? {
    unemploymentToError: true
  } : null;
}

export function unemploymentToCheck(control: AbstractControl) {
  return control.value.unemployment_stop_date < new Date() ? null : {
    unemploymentDateError: true
  };
}

export function compensationStartCheck(control: AbstractControl) {
  return !!control.value.compensated && !!control.value.unemployment_stop_date && !!control.value.compensation_start_date && control.value.compensation_start_date > control.value.unemployment_stop_date ? {
    compensationFromError: true
  } : !!control.value.compensated && !!control.value.unemployment_start_date && !!control.value.compensation_start_date && control.value.compensation_start_date < control.value.unemployment_start_date ? {
    compensationFromGreaterUnemploymentFrom: true
  } : null;
}

export function compensationStopCheck(control: AbstractControl) {
  return !!control.value.compensated && !!control.value.unemployment_stop_date && !!control.value.compensation_stop_date && control.value.compensation_stop_date > control.value.unemployment_stop_date ? {
    compensationStopError: true
  } : null;
}

export function compensationToCheck(control: AbstractControl) {
  return !!control.value.compensated && !!control.value.compensation_stop_date && !!control.value.compensation_start_date && control.value.compensation_stop_date < control.value.compensation_start_date ? {
    compensationToError: true
  } : null;
}

export function serviceDateCheck(control: AbstractControl) {
  return control.value < new Date() ? null : {
    serviceDateError: true
  };
}

export function serviceDateStopCheck(control: AbstractControl) {
  return control.value.service_stop < control.value.service_start ? {
    serviceDateStopError: true
  } : null;
}

export function requiredDate(control: AbstractControl) {
  return !control.value && control.value === null ? {
    required: true
  } : null;
}

export function validDateCheck(control: AbstractControl) {
  var date_regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return (!!control.value && !moment(control.value).isValid()) || ((!!control.value) && (!date_regex.test(moment(control.value).format('mm/DD/yyyy')) || moment(control.value).year().toString().length != 4)) ? {
    notADate: true
  } : null;
}

export function dswCheck(control: AbstractControl) {
  return !!control.value.dsw && !!control.value.doh && control.value.dsw < control.value.doh ? {
    dsw_error: true
  } : null;
}

export function dojoCheck(control: AbstractControl) {
  return !!control.value.dojo && !!control.value.dgi && control.value.dojo < control.value.dgi ? {
    dojo_error: true
  } : null;
}

export function dohCheck(control: AbstractControl) {
  return !!control.value.doh && !!control.value.dojo && control.value.doh < control.value.dojo ? {
    doh_error: true
  } : null;
}
