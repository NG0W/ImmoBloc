import React from "react";
import {Section, Add, Form} from "../components";
import {useParams} from "react-router-dom";
import {HeaderContainer, DashboardContainer, FooterContainer} from "../containers";
import {Description, Media} from "../partials/add_property_partials";

const AddListing = () => {
    const {id} = useParams();
    return (
        <>
            <HeaderContainer bg="false"/>
            <Section bgColor="--bs-fade-info">
                <Section.InnerContainer>
                    <DashboardContainer title={id ? "Edit Property" : "Add Property"}>
                        <Add>
                            <Form>
                                <Description/>
                                <Media/>
                                <Add.Footer>
                                    <Form.FormGroup class="form-group">
                                        <Form.SubmitInput type="submit" value={id ? "Update Property" : "Submit Property"}/>
                                    </Form.FormGroup>
                                    {id && (
                                        <Form.FormGroup class="form-group">
                                            <Form.SubmitInput type="submit" value="Cancel Update"/>
                                        </Form.FormGroup>
                                    )}
                                </Add.Footer>
                            </Form>
                        </Add>
                    </DashboardContainer>
                </Section.InnerContainer>
            </Section>
            <FooterContainer/>
        </>
    );
};

export default AddListing;
