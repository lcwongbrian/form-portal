import { useState, useRef } from "react";
import { Button, Modal, Form, Card, ListGroup, InputGroup, Row, Col, Alert } from "react-bootstrap";
import { createForm } from "@/lib/formApi";

export default function CreateModal(props) {
    const { show, hide } = props;
    const initialBuffer = {
        type: "text",
        label: "",
        selection: []
    };

    const nameRef = useRef();
    const dropdownRef = useRef();

    const [order, setOrder] = useState(0);    
    const [formData, setFormData] = useState([]);
    const [buffer, setBuffer] = useState(initialBuffer);
    const [isEdit, setIsEdit] = useState(false);
    const [error, setError] = useState(null);

    const reset = () => {
        setOrder(0);
        setBuffer[initialBuffer];
        setFormData([]);
        setIsEdit(false);
        setError(null);
    };

    const handleClickAddField = () => setIsEdit(true);
    const handleClickConfirmField = () => {
        if (buffer.label.trim() === "") {
            setError("Field label name is missing. Please fill up the label.");
            return;
        }
        if (buffer.type === "dropdown" && buffer.selection.length === 0) {
            setError("Dropdown option is empty. Please add at least one option.");
            return;
        }
        let formRes = JSON.parse(JSON.stringify(formData));
        formRes.push({
            order: order,
            label: buffer.label,
            type: buffer.type,
            selection: buffer.selection,
            input: ""
        });
        setIsEdit(false);
        setFormData(formRes);        
        setBuffer(initialBuffer);
        setOrder(order + 1);
        setError(null);
    }

    const handleClickSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const form = e.currentTarget
        if (form.checkValidity() === false) {
            setError("The form name is missing. Please fill up form name.");
            return;
        }
        if (formData.length === 0) {
            setError("The form field is empty. Please add at least one field.");
            return;
        }
        const body = {
            name: nameRef.current.value
        };
        
        body.fields = formData.map(field => {
            return {
                order: field.order,
                label: field.label,
                type: field.type,
                selection: field.selection,
                input: field.input
            };
        });
        const response = await createForm(body);
        if (response?.error?.code === 11000) {
            setError("This form name exists. Please use another form name.");
        } else if (response?._id) {
            hide();
        }
    };

    const handleChangeBufferType = e => {
        let res = JSON.parse(JSON.stringify(buffer));
        res.type = e.target.value;
        setBuffer(res);
    };

    const handleChangeBufferLabel = e => {
        let res = JSON.parse(JSON.stringify(buffer));
        res.label = e.target.value;
        setBuffer(res);
    };

    const handleChangeDropdownOption = (option, index) => {
        let res = JSON.parse(JSON.stringify(buffer));
        res.selection[index] = option;
        setBuffer(res);
    };

    const handleAddDropdownOption = (option) => {
        if (option && option !== "") {
            let res = JSON.parse(JSON.stringify(buffer));
            res.selection.push(option);
            setBuffer(res);
            dropdownRef.current.value = "";
        }
    };

    const showAddedFields = (field) => {
        let inputElem = null;
        switch(field.type) {
            case "dropdown":
                inputElem = (
                    <ListGroup.Item key={`field-${field.order}`}>
                        Dropdown: {field.label}
                        <br />
                        <ol>
                            { field.selection.map((option, optionIdx) =>
                                <li key={`option-${optionIdx}`}>{option}</li>
                            )}
                        </ol>
                    </ListGroup.Item>
                );
                break;
            case "text":
                inputElem = (
                    <ListGroup.Item key={`field-${field.order}`}>
                        Text: {field.label}
                    </ListGroup.Item>
                );
                break;
            default:
                inputElem = null;               
        }
        return inputElem;
    };

    return (
        <Modal
            size="lg"
            show={show}
            onHide={hide}
            onExited={reset}
            backdrop="static"
            keyboard={false}
        >
            <Form onSubmit={handleClickSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Form</Modal.Title>
                </Modal.Header>            
                <Modal.Body>
                    { error && <Alert variant="danger">{error}</Alert> }
                    <Form.Group as={Row}>
                        <Form.Label column sm="2">Form name</Form.Label>
                        <Col sm="10">
                            <Form.Control type="text" size="sm" ref={nameRef} required></Form.Control>
                        </Col>                    
                    </Form.Group>
                    <br />
                    { formData.length > 0 && 
                    <>
                        <Card>
                            <ListGroup variant="flush">
                                { formData.map(field => showAddedFields(field)) }
                            </ListGroup>
                        </Card>
                        <br />
                    </>
                    }
                    {
                    !isEdit ? 
                    <div className="d-grid gap-2 mt-2">
                        <Button variant="outline-success" size="sm" onClick={handleClickAddField}>Add Field</Button>
                    </div>
                    :
                    <Card>
                        <Card.Body>
                            <Form.Group as={Row}>
                                <Form.Label column sm="2">Input type</Form.Label>
                                <Col sm="10">
                                    <Form.Select size="sm" onChange={handleChangeBufferType}>
                                        <option value="text">Text</option>
                                        <option value="dropdown">Dropdown</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row}>
                                <Form.Label column sm="2">Label name</Form.Label>
                                <Col sm="10">
                                    <Form.Control size="sm" type="text" onChange={handleChangeBufferLabel} ></Form.Control>
                                </Col>                    
                            </Form.Group>
                            { buffer.type === "dropdown" ? 
                            <Form.Group>
                                <Form.Label>Option list</Form.Label>
                                {
                                buffer.selection.map((option, i) => 
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        onChange={e => handleChangeDropdownOption(e.target.value, i)}
                                        defaultValue={option}
                                        key={`option-${i}`}
                                    ></Form.Control>
                                )}
                                <InputGroup>
                                    <Form.Control
                                        size="sm"
                                        type="text"
                                        ref={dropdownRef}
                                    ></Form.Control>
                                    <Button variant="outline-success" size="sm" onClick={() => handleAddDropdownOption(dropdownRef.current.value)}>Add Option</Button>
                                </InputGroup>
                            </Form.Group> : null
                            }
                            <div className="d-grid gap-2 mt-2">
                                <Button variant="outline-success" size="sm" onClick={handleClickConfirmField}>Add Next</Button>
                            </div>
                        </Card.Body>
                    </Card>                    
                    }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hide}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">Submit</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};