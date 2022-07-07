import {Add, Form} from "../components";
import React, {useState, useRef} from "react";
import {toast} from "react-toastify";

const Description = ({setAuth}) => {
    const [inputs, setInputs] = useState({
        name: "",
        address: "",
        type: "",
        id_agence: "",
        id_status: "",
        value: "",
        max_refunds: ""
    });

    const {name, address, type, id_agence, id_status, value, max_refunds} = inputs;

    const onChange = e => setInputs({...inputs, [e.target.name]: e.target.value});

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = {name, address, type, id_agence, id_status, value, max_refunds};
            console.log(body)
            const response = await fetch("http://localhost:5000/authentication/add_asset", {
                method: "POST",
                headers: {"Content-type": "application/json"},
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();

            if (parseRes.jwtToken) {
                localStorage.setItem("token", parseRes.jwtToken);
                setAuth(true);
                toast.success("Register Successfully");
            } else {
                setAuth(false);
                toast.error(parseRes);
            }
        } catch (err) {
            console.error(err.message);
        }
    };
    return (
        <Form onSubmit={onSubmitForm}>
            <Form.FormGroup>
                <Form.Label>Name</Form.Label>
                <Form.Input type="text" name="name" value={name} placeholder="name" onChange={e => onChange(e)}/>
            </Form.FormGroup>
            <Form.FormGroup>
                <Form.Label>address</Form.Label>
                <Form.Input type="text" name="address" value={address} placeholder="address" onChange={e => onChange(e)}/>
            </Form.FormGroup>
            <Form.FormGroup>
                <Form.Label>type</Form.Label>
                <Form.Input type="text" name="type" value={type} placeholder="type" onChange={e => onChange(e)}/>
            </Form.FormGroup>
            <Form.FormGroup>
                <Form.Label>id_agence</Form.Label>
                <Form.Input type="text" name="id_agence" value={id_agence} placeholder="id_agence" onChange={e => onChange(e)}/>
            </Form.FormGroup>
            <Form.FormGroup>
                <Form.Label>id_status</Form.Label>
                <Form.Input type="text" name="id_status" value={id_status} placeholder="id_status" onChange={e => onChange(e)}/>
            </Form.FormGroup>
            <Form.FormGroup>
                <Form.Label>value</Form.Label>
                <Form.Input type="text" name="value" value={value} placeholder="value" onChange={e => onChange(e)}/>
            </Form.FormGroup>
            <Form.FormGroup>
                <Form.Label>max_refunds</Form.Label>
                <Form.Input type="text" name="max_refunds" value={max_refunds} placeholder="max_refunds" onChange={e => onChange(e)}/>
            </Form.FormGroup>
            <Form.FormGroup>
                <Form.SubmitInput type="submit" value="Signup"/>
            </Form.FormGroup>
        </Form>
    );
};

const Media = () => {
    const hiddenFileInput = useRef(null);

    const handleFileButton = (e) => {
        e.preventDefault();
        hiddenFileInput.current.click();
    };

    return (
        <Add.Media>
            <Add.MediaHeader>
                <Add.Title>Property Images</Add.Title>
            </Add.MediaHeader>
            <Add.MediaContent>
                <Form.FormGroup>
                    <Form.Label>Images</Form.Label>
                    <input type="file" ref={hiddenFileInput} style={{display: "none"}}/>
                    <Add.Button onClick={handleFileButton}>Upload Files</Add.Button>
                </Form.FormGroup>
            </Add.MediaContent>
        </Add.Media>
    );
};

const Details = () => {
    return (
        <Add.Details>
            <Add.DetailsHeader>
                <Add.Title>Property Details</Add.Title>
            </Add.DetailsHeader>
            <Add.DetailsContent>
                <Form.FormGroup>
                    <Form.Label>Rooms</Form.Label>
                    <Form.Input type="text"/>
                </Form.FormGroup>
                <Form.FormGroup>
                    <Form.Label>Bedrooms</Form.Label>
                    <Form.Input type="text"/>
                </Form.FormGroup>
                <Form.FormGroup>
                    <Form.Label>Bathrooms</Form.Label>
                    <Form.Input type="text"/>
                </Form.FormGroup>
                <Form.FormGroup>
                    <Form.Label>Structure Type</Form.Label>
                    <Form.Select name="none" id="" class="form-select">
                        <Form.Option disabled defaultValue>Not Available</Form.Option>
                        <Form.Option>Brick</Form.Option>
                        <Form.Option>Wood</Form.Option>
                        <Form.Option>Cement</Form.Option>
                    </Form.Select>
                </Form.FormGroup>
            </Add.DetailsContent>
        </Add.Details>
    );
};

export {Description, Media, Details};
