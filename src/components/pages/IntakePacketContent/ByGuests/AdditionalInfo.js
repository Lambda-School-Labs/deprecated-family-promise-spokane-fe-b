import React from 'react';
import { Form, Button, Card, Input, Checkbox, Row, Col, Progress } from 'antd';
import { axiosWithAuth } from '../../../../api/axiosWithAuth';
import { useHistory } from 'react-router-dom';
import {
  returnPercentComplete,
  completed,
} from '../../../../utils/percentComplete';

const AdditionalInfo = ({
  navigation,
  tempFormStyle,
  formData,
  setForm,
  steps,
  step,
}) => {
  const pageNumber = steps.findIndex(item => item === step);
  const pages = steps.length;
  const percent = (pageNumber / pages) * 100;
  const { previous } = navigation;
  const { familyInfo, familyMember } = formData;
  const history = useHistory();

  const submitHandlder = e => {
    e.preventDefault();
    // Contact Info Page calculation ///
    const phone1 = Object.entries(familyInfo.phone_one).reduce(
      (a, [k, v]) => (v ? ((a[k] = v), a) : a),
      {}
    );
    const phone2 = Object.entries(familyInfo.phone_two).reduce(
      (a, [k, v]) => (v ? ((a[k] = v), a) : a),
      {}
    );
    const emerg = Object.entries(familyInfo.emergencyContact).reduce(
      (a, [k, v]) => (v ? ((a[k] = v), a) : a),
      {}
    );
    const contactSum =
      Object.keys(phone1).length +
      Object.keys(phone2).length +
      Object.keys(emerg).length;
    console.log(` Contact Info: ${contactSum}/8 fields`);
    // Homeless Info Page calculation ///
    const lastPermanentAddress =
      familyInfo.last_permanent_address != null ? 1 : 0;
    const homelessInfo = Object.entries(familyInfo.homeless_info).reduce(
      (a, [k, v]) => (v ? ((a[k] = v), a) : a),
      {}
    );
    const sum = Object.keys(homelessInfo).length + lastPermanentAddress;
    console.log(`Homeless Info: ${sum}/8 fields`);
    // Domestic Info Page Calculation ////
    const domesticVInfo = Object.entries(
      familyInfo.domestic_violence_info
    ).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {});
    const domesticInfoSum = Object.keys(domesticVInfo).length;
    console.log(`Domestic Violence: ${domesticInfoSum}/5 fields`);
    // Insurance Info Page Calculation ////
    const insurance = Object.entries(familyInfo.insurance).reduce(
      (a, [k, v]) => (v ? ((a[k] = v), a) : a),
      {}
    );
    const insuranceSum = Object.keys(insurance).length;
    console.log(`Insurance: ${insuranceSum}/3 fields`);
    // Additonal Info Page Calculation
    const govtBnfts = Object.entries(familyInfo.gov_benefits).reduce(
      (a, [k, v]) => (v ? ((a[k] = v), a) : a),
      {}
    );
    const govtBnftSum = Object.keys(govtBnfts).length;
    const vechileInf = Object.entries(familyInfo.vehicle).reduce(
      (a, [k, v]) => (v ? ((a[k] = v), a) : a),
      {}
    );
    const vechileInfSum = Object.keys(vechileInf).length;
    const pregnancyInfo = Object.entries(
      familyInfo.insurance.pregnancies
    ).reduce((a, [k, v]) => (v ? ((a[k] = v), a) : a), {});
    const pregnancyInfoSum = Object.keys(pregnancyInfo).length;
    console.log(
      `Additional Info: ${govtBnftSum +
        vechileInfSum +
        pregnancyInfoSum}/14 fields `
    );

    // axiosWithAuth()
    //   .post(`families`, familyInfo)
    //   .then(res => {
    //     console.log(res);
    //     Object.keys(formData.familyMember).map(mem => {
    //       axiosWithAuth()
    //         .post('members', familyMember[mem])
    //         .then(res => {
    //           console.log(res);
    //         })
    //         .catch(err => {
    //           console.log('MemberError', err);
    //         });
    //       history.push('/me');
    //     });
    //   })
    //   .catch(err => console.log('FamiliesError', err));
  };
  const familyInfoNameString = (section, value) => {
    return `familyInfo.${section}.${value}`;
  };
  const GOVBenifits = [
    'Foodstamps',
    'CPS/FPS (Open case)',
    'RRH (Rapid Rehousing) ',
    'Housing Voucher (Current)',
    'Veteran Services',
    'SNAP assistance',
  ];
  const GOVBenifitsDataName = {
    Foodstamps: 'foodstamps',
    'CPS/FPS (Open case)': 'cps_fps',
    'RRH (Rapid Rehousing) ': 'RRH',
    'Housing Voucher (Current)': 'housing_voucher',
    'Veteran Services': 'veteran_services',
    'SNAP assistance': 'snap',
  };
  const VehicleInfo = ['Vehicle Make', 'Model', 'Year', 'Color', 'Lic #'];
  const VehicleInfoDataNames = {
    'Vehicle Make': 'make',
    Model: 'model',
    Year: 'year',
    Color: 'color',
    'Lic #': 'license_plate',
  };
  return (
    <div style={tempFormStyle}>
      <Progress percent={percent} status="active" showInfo={false} />
      <Card title="Additional Information" bordered={false}>
        <Form.Item>
          <Button type="primary" htmlType="button" onClick={previous}>
            Previous
          </Button>
          <Button type="button" htmlType="Submit" onClick={submitHandlder}>
            Submit
          </Button>
        </Form.Item>

        <Form layout="vertical">
          <Form.Item label="Vehicle Information:">
            <Input.Group>
              {VehicleInfo.map((label, key) => (
                <Form.Item label={label} key={key}>
                  <Input
                    name={familyInfoNameString(
                      'vehicle',
                      VehicleInfoDataNames[label]
                    )}
                    value={familyInfo.vehicle[VehicleInfoDataNames[label]]}
                    onChange={setForm}
                  />
                </Form.Item>
              ))}
            </Input.Group>
          </Form.Item>

          <Form.Item label="Please check all that you currently receive:">
            <Row>
              {GOVBenifits.map(benifit => (
                <Col span={4}>
                  <Form.Item label={benifit}>
                    <Checkbox
                      defaultChecked={
                        familyInfo.gov_benefits[GOVBenifitsDataName[benifit]]
                      }
                      name={familyInfoNameString(
                        'gov_benefits',
                        GOVBenifitsDataName[benifit]
                      )}
                      onChange={setForm}
                    />
                  </Form.Item>
                </Col>
              ))}
            </Row>
          </Form.Item>

          <Form.Item>
            <Checkbox
              style={{ marginBottom: '10px' }}
              name="familyInfo.insurance.pregnancies.is_pregnant"
              onChange={setForm}
              defaultChecked={familyInfo.insurance.pregnancies.is_pregnant}
            >
              Is any one in your Household pregnant?
            </Checkbox>
            <Form.Item label="If yes, who?">
              <Input
                name="familyInfo.insurance.pregnancies.if_yes_who"
                value={familyInfo.insurance.pregnancies.if_yes_who}
                onChange={setForm}
              />
            </Form.Item>
            <Form.Item label="When is the due date?">
              <Input
                name="familyInfo.insurance.pregnancies.due_date"
                value={familyInfo.insurance.pregnancies.due_date}
                onChange={setForm}
              />
            </Form.Item>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AdditionalInfo;
