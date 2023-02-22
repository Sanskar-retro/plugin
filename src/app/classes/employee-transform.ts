import * as moment from 'moment';

export class EmployeeTransform {
  tranformEmployee(employee: any, userInfo: any, isApplicant?: boolean) {

    if (userInfo.role === 'processor') {
      employee.data.employee_info = {
        ...employee.data.employee_info,
        'client_id': employee.data.employee_info.client?.id,
        'legal_name': employee.data.employee_info.client?.name,
        'location_id': employee.data.employee_info.location?.id,
        'location_name': employee.data.employee_info.location?.name,
        'dob': moment(employee.data.employee_info.dob).format('YYYY-MM-DD'),
        'is_applicant': isApplicant,
        'company_id': employee.data.employee_info.company?.id,
        'address_line_1': employee.data.employee_info.geoQualifiedAddress ? employee.data.employee_info.geo_qualified_address_line_1 : employee.data.employee_info.address_line_1,
        'address_line_2': employee.data.employee_info.geoQualifiedAddress ? employee.data.employee_info.geo_qualified_address_line_2 : employee.data.employee_info.address_line_2,
        'city': employee.data.employee_info.geoQualifiedAddress ? employee.data.employee_info.geo_qualified_city : employee.data.employee_info.city,
        'state': employee.data.employee_info.geoQualifiedAddress ? employee.data.employee_info.geo_qualified_state?.code : employee.data.employee_info.state?.code,
        'zip': employee.data.employee_info.geoQualifiedAddress ? employee.data.employee_info.geo_qualified_zip : employee.data.employee_info.zip,
      };
      employee.data.employee_info = _.omit(employee.data.employee_info, ['manualAddress', 'geoQualifiedAddress', 'geo_qualified_address_line_1', 'geo_qualified_address_line_2', 'geo_qualified_city', 'geo_qualified_state', 'geo_qualified_zip', 'zipSearch', 'company']);
    } else {
      employee.data.employee_info = {
        ...employee.data.employee_info,
        'client_id': (employee.data.employee_info.client?.id|| employee.data.employee_info.client_id),
        'client_name': employee.data.employee_info.client?.name,
        'company_id': (employee.data.employee_info.company?.id|| employee.data.employee_info.company_id),
        'location_id': (employee.data.employee_info.location?.id || employee.data.employee_info.location_id),
        'location_name': employee.data.employee_info.location?.name,
        'is_applicant': isApplicant,
        'state': employee.data.employee_info?.state?.code,
        'dob': moment(employee.data.employee_info.dob).format('YYYY-MM-DD')
      }
      employee.data.employee_info = _.omit(employee.data.employee_info, ['company']);
    }

    !!employee.data.questionnaire?.afdc ? employee.data.afdc_recipient_info = {
      ...employee.data.afdc_recipient_info,
      'state_received': employee.data.afdc_recipient_info.state_received?.code,
      'county_received': employee.data.afdc_recipient_info.county_received?.id
    } : _.unset(employee.data, ['afdc_recipient_info']);

    !!employee.data.questionnaire?.food_stamps ? employee.data.foodstamps_recipient_info = {
      ...employee.data.foodstamps_recipient_info,
      'state_received': employee.data.foodstamps_recipient_info.state_received?.code,
      'county_received': employee.data.foodstamps_recipient_info.county_received?.id
    } : _.unset(employee.data, ['foodstamps_recipient_info']);;

    !!employee.data.questionnaire?.voc_rehab ? employee.data.voc_rehab_info = {
      ...employee.data.voc_rehab_info,
      'state': employee.data.voc_rehab_info.state?.code,
      'county': employee.data.voc_rehab_info.county?.id
    } : _.unset(employee.data, ['voc_rehab_info']);

    !!employee.data.questionnaire?.felon ? employee.data.felon_info = {
      ...employee.data.felon_info,
      'felony_state': employee.data.felon_info.felony_state?.code,
      'felony_county': employee.data.felon_info.felony_county?.id,
      'conviction_date': moment(employee.data.felon_info.conviction_date).format('YYYY-MM-DD'),
      'release_date': moment(employee.data.felon_info.release_date).format('YYYY-MM-DD')
    } : _.unset(employee.data, ['felon_info']);

    !!employee.data.questionnaire?.veteran ? employee.data.veteran_info = {
      ...employee.data.veteran_info,
      'service_start': moment(employee.data.veteran_info.service_start).format('YYYY-MM-DD'),
      'service_stop': moment(employee.data.veteran_info.service_stop).format('YYYY-MM-DD')
    } : _.unset(employee.data, ['veteran_info']);

    !!employee.data.questionnaire?.unemployed ? employee.data.unemployment_info = {
      ...employee.data.unemployment_info,
      'unemployment_compensation_state': employee.data.unemployment_info.unemployment_compensation_state?.code,
      'compensation_start_date': moment(employee.data.unemployment_info.compensation_start_date).format('YYYY-MM-DD'),
      'compensation_stop_date': moment(employee.data.unemployment_info.compensation_stop_date).format('YYYY-MM-DD'),
      'unemployment_start_date': moment(employee.data.unemployment_info.unemployment_start_date).format('YYYY-MM-DD'),
      'unemployment_stop_date': moment(employee.data.unemployment_info.unemployment_stop_date).format('YYYY-MM-DD')
    } : _.unset(employee.data, ['unemployment_info']);

    !!employee.data.hiring_manager_info && !isApplicant && userInfo.role !== 'employee' ? employee.data.hiring_manager_info = {
      ...employee.data.hiring_manager_info,
      'occupation_id': employee.data.hiring_manager_info.occupation_id?.code,
      'dgi': moment(employee.data.hiring_manager_info.dgi).format('YYYY-MM-DD'),
      'doh': moment(employee.data.hiring_manager_info.doh).format('YYYY-MM-DD'),
      'dojo': moment(employee.data.hiring_manager_info.dojo).format('YYYY-MM-DD'),
      'dsw': userInfo.role === 'processor' ? moment(employee.data.employee_info.dateStartedWork).format('YYYY-MM-DD') : moment(employee.data.hiring_manager_info.dsw).format('YYYY-MM-DD'),
    } : _.unset(employee.data, 'hiring_manager_info');

    employee.data.employee_info.rehire === 'true' ? _.unset(employee.data, 'questionnaire') : '';

    isApplicant ? _.omit(employee.data.e_signatures.hm_signature, ['hasErrors']) : '';
    employee.data.e_signatures?.hm_signature?.esign ? '' : _.unset(employee.data, ['e_signatures']);
    employee.data.employee_info = _.omit(employee.data.employee_info, ['hasErrors', 'client', 'location', 'dateStartedWork']);
    employee.data.questionnaire = _.omit(employee.data.questionnaire, ['hasErrors']);
    employee.data.hiring_manager_info = _.omit(employee.data.hiring_manager_info, ['hasErrors']);
    _.set(employee.data, 'persistent', employee.persistent ? true : false);
    userInfo.role === 'employee' ? _.unset(employee.data, ['hiring_manager_info']) : '';
  }

  // for Plugin ----------------------------------------------------------------
  transformPluginEmployee(employee: any, userInfo: any, isApplicant?: boolean){
    // Employee info ---------------------------------------------------------------
    _.set(employee,'data.employee_info' , {
      ...employee.data.employee_info,
      'client_id': (employee.data.employee_info.client?.id|| employee.data.employee_info.client),
      'client_name': employee.data.employee_info.client?.name,
      'company_id': (employee.data.employee_info.company?.id|| employee.data.employee_info.company),
      'location_id': (employee.data.employee_info.location?.id || employee.data.employee_info.location),
      'location_name': employee.data.employee_info.location?.name,
      'is_applicant': isApplicant,
      'state': employee.data.employee_info?.state?.code,
      'dob': moment(employee.data.employee_info.dob).format('YYYY-MM-DD'),
      'rehire':employee.data.employee_info?.rehire,
    })
    employee.data.employee_info = _.omit(employee.data.employee_info, ['company'])    
    // Questionnaire ------------------------------------------------------------------
    if(!employee.data.employee_info.rehire){
      !!employee.data.questionnaire?.afdc ? employee.data.afdc_recipient_info = {
        ...employee.data.afdc_recipient_info,
        'state_received': employee.data.afdc_recipient_info.state_received?.code,
        'county_received': employee.data.afdc_recipient_info.county_received?.id
      } : _.unset(employee.data, ['afdc_recipient_info']);
  
      !!employee.data.questionnaire?.food_stamps ? employee.data.foodstamps_recipient_info = {
        ...employee.data.foodstamps_recipient_info,
        'state_received': employee.data.foodstamps_recipient_info.state_received?.code,
        'county_received': employee.data.foodstamps_recipient_info.county_received?.id
      } : _.unset(employee.data, ['foodstamps_recipient_info']);;
  
      !!employee.data.questionnaire?.voc_rehab ? employee.data.voc_rehab_info = {
        ...employee.data.voc_rehab_info,
        'state': employee.data.voc_rehab_info.state?.code,
        'county': employee.data.voc_rehab_info.county?.id
      } : _.unset(employee.data, ['voc_rehab_info']);
  
      !!employee.data.questionnaire?.felon ? employee.data.felon_info = {
        ...employee.data.felon_info,
        'felony_state': employee.data.felon_info.felony_state?.code,
        'felony_county': employee.data.felon_info.felony_county?.id,
        'conviction_date': moment(employee.data.felon_info.conviction_date).format('YYYY-MM-DD'),
        'release_date': moment(employee.data.felon_info.release_date).format('YYYY-MM-DD')
      } : _.unset(employee.data, ['felon_info']);
  
      !!employee.data.questionnaire?.veteran ? employee.data.veteran_info = {
        ...employee.data.veteran_info,
        'service_start': moment(employee.data.veteran_info.service_start).format('YYYY-MM-DD'),
        'service_stop': moment(employee.data.veteran_info.service_stop).format('YYYY-MM-DD')
      } : _.unset(employee.data, ['veteran_info']);
  
      !!employee.data.questionnaire?.unemployed ? employee.data.unemployment_info = {
        ...employee.data.unemployment_info,
        'unemployment_compensation_state': employee.data.unemployment_info.unemployment_compensation_state?.code,
        'compensation_start_date': moment(employee.data.unemployment_info.compensation_start_date).format('YYYY-MM-DD'),
        'compensation_stop_date': moment(employee.data.unemployment_info.compensation_stop_date).format('YYYY-MM-DD'),
        'unemployment_start_date': moment(employee.data.unemployment_info.unemployment_start_date).format('YYYY-MM-DD'),
        'unemployment_stop_date': moment(employee.data.unemployment_info.unemployment_stop_date).format('YYYY-MM-DD')
      } : _.unset(employee.data, ['unemployment_info']);
  
    }

    // Job Info ----------------------------------------------------------
    !!employee.data.hiring_manager_info && !isApplicant && userInfo.role !== 'employee' ? employee.data.hiring_manager_info = {
      ...employee.data.hiring_manager_info,
      'occupation_id': employee.data.hiring_manager_info.occupation_id,
      'dgi': moment(employee.data.hiring_manager_info.dgi).format('YYYY-MM-DD'),
      'doh': moment(employee.data.hiring_manager_info.doh).format('YYYY-MM-DD'),
      'dojo': moment(employee.data.hiring_manager_info.dojo).format('YYYY-MM-DD'),
      'dsw': userInfo.role === 'processor' ? moment(employee.data.employee_info.dateStartedWork).format('YYYY-MM-DD') : moment(employee.data.hiring_manager_info.dsw).format('YYYY-MM-DD'),
    } : _.unset(employee.data, 'hiring_manager_info');

    employee.data.employee_info.rehire === 'true' ? _.unset(employee.data, 'questionnaire') : '';

    // esign ----------------------------------------------------------------
    isApplicant ? _.omit(employee.data.e_signatures.hm_signature, ['hasErrors']) : '';
    employee.data.e_signatures?.hm_signature?.esign ? '' : _.unset(employee.data, ['e_signatures']);

    employee.data.employee_info = _.omit(employee.data.employee_info, ['hasErrors', 'client', 'location', 'dateStartedWork']);
    employee.data.questionnaire = _.omit(employee.data.questionnaire, ['hasErrors']);
    employee.data.hiring_manager_info = _.omit(employee.data.hiring_manager_info, ['hasErrors']);
    _.set(employee.data, 'persistent', employee.persistent ? true : false);
    userInfo.role === 'employee' ? _.unset(employee.data, ['hiring_manager_info']) : '';

  }
}

export class EBasicData {
  static employeeData() {
    return {
      data: {
        employee_info: { hasErrors: false },
        questionnaire: { hasErrors: false },
        voc_rehab_info: { hasErrors: false },
        felon_info: { hasErrors: false },
        veteran_info: { hasErrors: false },
        foodstamps_recipient_info: { hasErrors: false },
        afdc_recipient_info: { hasErrors: false },
        unemployment_info: { hasErrors: false },
        e_signatures: {
          hm_signature: {
            hasErrors: false
          }
        }
      },
      focussedTab: 'employee_info'
    }
  }

  static hmData() {
    return {
      data: {
        employee_info: { hasErrors: false },
        questionnaire: { hasErrors: false },
        hiring_manager_info: { hasErrors: false },
        voc_rehab_info: { hasErrors: false },
        felon_info: { hasErrors: false },
        veteran_info: { hasErrors: false },
        foodstamps_recipient_info: { hasErrors: false },
        afdc_recipient_info: { hasErrors: false },
        unemployment_info: { hasErrors: false },
        e_signatures: {
          hm_signature: {
            hasErrors: false
          }
        }
      },
      focussedTab: 'employee_info'
    }
  }

  static processorData() {
    return {
      data: {
        employee_info: { hasErrors: false },
        questionnaire: { hasErrors: false },
        voc_rehab_info: { hasErrors: false },
        felon_info: { hasErrors: false },
        veteran_info: { hasErrors: false },
        foodstamps_recipient_info: { hasErrors: false },
        afdc_recipient_info: { hasErrors: false },
        unemployment_info: { hasErrors: false },
      },
      focussedTab: 'employee_info'
    }
  }

  static hmCreatedEmp() {
    return {
      data: {
        employee_info: { hasErrors: false },
        questionnaire: { hasErrors: false },
        hiring_manager_info: { hasErrors: false },
        voc_rehab_info: { hasErrors: false },
        felon_info: { hasErrors: false },
        veteran_info: { hasErrors: false },
        foodstamps_recipient_info: { hasErrors: false },
        afdc_recipient_info: { hasErrors: false },
        unemployment_info: { hasErrors: false },
        e_signatures: {
          hm_signature: {
            hasErrors: false
          }
        },
        application_status: {},
        zone_status: {},
        suppl_program_status: {},
        dates: {},
        qualifications: {}
      },
      focussedTab: 'employee_info'
    }
  }
}
