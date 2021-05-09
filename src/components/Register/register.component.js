import React, { Component } from 'react';
import { Form, Input, Label, FormGroup, FormFeedback, Button, Alert } from 'reactstrap';
import { isEmail } from 'validator';
import axios from 'axios'
import './toggle-radios.css'



class Register extends Component {

 indianStates = {
     myarray : ["Andaman And Nicobar Islands", "Andhra Pradesh","Arunachal Pradesh", "Assam", "Bihar", "Chandigarh","Chhattisgarh","Dadra And Nagar Haveli","Delhi","Goa","Gujarat",
    "Haryana","Himachal Pradesh","Jammu And Kashmir","Jharkhand","Karnataka","Kerala","Ladakh","Lakshadweep","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Puducherry","Punjab","Rajasthan",
"Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Daman And Diu"]
 }

    constructor(props) {
        super(props);

        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        data: {
            notificationType : 'p',
            pincode: '',
            email: '',
            minAgeLimit: 'YO',
            district: [],
            selectedState: '-1',
            selectedDistrict: '-1',
            selectedDistrictName: '-1',
            alertSuccess: false,
            alertFailure: false
        },
        errors: {}
    });

    handleChange = (e) => {
        this.setState({
            data: {
                ...this.state.data,
                [e.target.name]: e.target.value
            },
            errors: {
                ...this.state.errors,
                [e.target.name]: ''
            }
        });
    }

    closeSuccessAlert = (e) => {
        this.setState({
            data: {
                ...this.state.data,
                alertSuccess: false
            },
            errors: {
                ...this.state.errors,
            }
        });
    }

    closeFailureAlert = (e) => {
        this.setState({
            data: {
                ...this.state.data,
                alertFailure: false
            },
            errors: {
                ...this.state.errors,
                [e.target.name]: ''
            }
        });
    }

    

    handleStateDropdown = (e) => {
        let index = e.target.value;
        fetch('https://cdn-api.co-vin.in/api/v2/admin/location/districts/'+index).then((resp)=>{
            resp.json().then((result)=>{
                this.setState({
                    data: {
                        ...this.state.data,
                        district: result.districts,
                        selectedState: index,
                        selectedDistrict: '-1'
                    },
                    errors: {
                        ...this.state.errors,
                        selectedState: ''
                    }
                });
            })
        })

    }

    handleDistrictDropdown = (e) => {
        var index = e.nativeEvent.target.selectedIndex;
        this.setState({
            data: {
                ...this.state.data,
                selectedDistrict: e.target.value,
                selectedDistrictName: e.nativeEvent.target[index].text
            },
            errors: {
                ...this.state.errors,
                selectedDistrict: ''
            }
        });
    }


    validate = () => {
        const { data } = this.state;
        let errors = {};
        if(data.notificationType === 'p'){
            var re = new RegExp("^[1-9][0-9]{5}$");
            if (!re.test(data.pincode)) errors.pincode = 'Pincode must be valid';
            if (data.pincode === '') errors.pincode = 'Pincode can not be blank';
        } else {
            if (data.selectedState === '-1') errors.selectedState = 'Please select state';
            if (data.selectedDistrict === '-1') errors.selectedDistrict = 'Please select district';
        }

        if (!isEmail(data.email)) errors.email = 'Email must be valid';
        if (data.email === '') errors.email = 'Email can not be blank';
  

        return errors;
    }

    handleSubmit = (e) => {
        e.preventDefault();

        const { data } = this.state;

        const errors = this.validate();


        if (Object.keys(errors).length === 0) {
            //Call an api here
            let url = "https://api.subhu.in/notification";
            let payload;
            if(data.notificationType === 'p'){
                  payload = {
                    "notificationType" : "p",
                    "data" : data.pincode,
                    "email": data.email,
                    "minAgeLimit" : data.minAgeLimit,
                    "distName" : ''
                };
            } else {
                 payload = {
                    "notificationType" : "d",
                    "data" : data.selectedDistrict,
                    "email": data.email,
                    "minAgeLimit" : data.minAgeLimit,
                    "distName" : data.selectedDistrictName
                };
            }

            console.log(payload);
            axios.post(url, payload).then(response =>{
                console.log(response.data.success);
                if(response.data.success){
                    this.setState({
                        data: {
                            ...this.state.data,
                            alertSuccess: true
                        
                        },
                        errors: {
                            ...this.state.errors,
                        }
                    });

                    setTimeout(() =>{ 
                        this.setState({
                            data: {
                                ...this.state.data,
                                alertSuccess: false
                            
                            },
                            errors: {
                                ...this.state.errors,
                            }
                        });

                     }, 3000);
                }
                else {
                     this.setState({
                        data: {
                            ...this.state.data,
                            alertFailure: true
                        
                        },
                        errors: {
                            ...this.state.errors,
                        }
                    });

                    setTimeout(()=>{ 
                        this.setState({
                            data: {
                                ...this.state.data,
                                alertFailure: false
                            
                            },
                            errors: {
                                ...this.state.errors,
                            }
                        });

                     }, 3000);
                }
            }).catch(error => {
                this.setState({
                    data: {
                        ...this.state.data,
                        alertFailure: true
                    
                    },
                    errors: {
                        ...this.state.errors,
                    }
                });

                setTimeout(()=>{ 
                    this.setState({
                        data: {
                            ...this.state.data,
                            alertFailure: false
                        
                        },
                        errors: {
                            ...this.state.errors,
                        }
                    });

                 }, 3000);


            })
            

            //Resetting the form
            this.setState(this.getInitialState());
        } else {
            this.setState({ errors });
        }
    }

    render() {
        const { data, errors } = this.state;
        return (<div>

            <Form onSubmit={this.handleSubmit}>
            <FormGroup>
                <Alert color="success" isOpen = {data.alertSuccess} toggle = {this.closeSuccessAlert} >Notification added successfully !!</Alert>
                <Alert color="danger" isOpen = {data.alertFailure} toggle = {this.closeFailureAlert} >Some error occured, please try after some time !!</Alert>
            </FormGroup>

            <FormGroup>
                <div class="toggle-radio" data-color="blue">
            <input type="radio" value = "p" checked = {data.notificationType === "p"} name="notificationType" id = "notificationTypeP" onChange = {this.handleChange}/>
            <label for = "notificationTypeP">Notify by pincode</label>
            <input type="radio" value = "d" checked = {data.notificationType === "d"} name="notificationType" id = "notificationTypeD" onChange = {this.handleChange}/>
            <label for = "notificationTypeD">Notify by district</label>
            </div>
            </FormGroup>
            { data.notificationType ==='p' ?
            <div>
            <FormGroup>
                    <Label for="pincode"><b>Pincode</b></Label>
                    <Input id="pincode" value={data.pincode} invalid={errors.pincode ? true : false} name="pincode" onChange={this.handleChange} />
                    <FormFeedback>{errors.pincode}</FormFeedback>
                </FormGroup>
             </div>
             :
             <div>
                <FormGroup>
                <Label for="selectedState"><b>State</b></Label>
                <Input type = "select" onChange = {this.handleStateDropdown} invalid={errors.selectedState ? true : false} name = "selectedState">
                   <option disabled selected = {data.selectedState ==="-1"}>Select State</option>
                    {this.indianStates.myarray.map((state, index)=> (
                        <option value = {index + 1}>{state}</option>
                    ))}
                </Input>
                <FormFeedback>{errors.selectedState}</FormFeedback>

                </FormGroup>


                <FormGroup>
                <Label for="selectedDistrict"><b>District</b></Label>
                <Input type = "select" onChange = {this.handleDistrictDropdown} invalid={errors.selectedDistrict ? true : false} name = "selectedDistrict">
                <option disabled selected = {data.selectedDistrict ==="-1"}>Select District</option>
                    {this.state.data.district.map((district)=> (
                        <option value ={district.district_id}> {district.district_name}</option>
                    ))} 
                </Input>
                <FormFeedback>{errors.selectedDistrict}</FormFeedback>

                </FormGroup>
                </div>
                }

                <FormGroup>
                    <Label for="email"><b>Email</b></Label>
                    <Input id="email" value={data.email} invalid={errors.email ? true : false} name="email" onChange={this.handleChange} />
                    <FormFeedback>{errors.email}</FormFeedback>
                </FormGroup>

            
                <FormGroup >
                <Label for="minAgeLimit"><b>Age</b></Label>
        </FormGroup>
        <FormGroup >

        <div class="toggle-radio" data-color="blue">
            <Input type="radio" value = "YO" checked = {data.minAgeLimit === "YO"} name="minAgeLimit" id = "minAgeLimitYO" onChange = {this.handleChange}/>
            
            <Label for = "minAgeLimitYO"> All age</Label>
       
            <Input type="radio" value = "Y" checked = {data.minAgeLimit === "Y"} name="minAgeLimit" id = "minAgeLimitY" onChange = {this.handleChange}/>
            
            <Label for = "minAgeLimitY"> 18 - 44 </Label>
          
            <Input type="radio" value = "O" checked = {data.minAgeLimit === "O"} name="minAgeLimit" id = "minAgeLimitO"  onChange = {this.handleChange}/>
       
            <Label for = "minAgeLimitO"> 45+ </Label>
            </div>
            </FormGroup>


                <Button className="submit" color="primary">Register</Button>
            </Form>
            </div>
        );
    }
}

export default Register;
