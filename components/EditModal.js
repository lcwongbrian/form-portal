import { useState, useEffect } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { editFormById } from "@/lib/formApi";

export default function EditModal(props) {
    const { form, show, hide } = props;
    
    const [formData, setFormData] = useState(null);

    const compareOrder = (a, b) => {
        return b.order < a.order ? 1 : (a.order < b.order ? -1 : 0);
    };

    const handleClickSubmit = async (e) => {
        const body = {};

        e.preventDefault();
        e.stopPropagation();
        
        body.fields = formData.fields.map(field => {
            return {
                selection: field.selection,
                order: field.order,
                label: field.label,
                type: field.type,
                input: field.input
            };
        });
        const response = await editFormById(formData._id, body);
        console.log(response)
        hide();
    };

    const handleChangeValue = (order, value) => {
        let result = JSON.parse(JSON.stringify(formData));
        const idx = formData.fields.findIndex(item => item.order === order);
        result.fields[idx].input = value;
        setFormData(result);
    };

    const toggleFormElement = (field) => {
        let inputElem = null;
        switch(field.type) {
            case "dropdown":
                inputElem = <Form.Select value={ field.input } onChange={(e) => { handleChangeValue(field.order, e.target.value); }}>
                    { field.selection.map((option, i) => <option key={`option-${option}`} value={option}>{option}</option>) }
                </Form.Select>;
                break;
            case "text":
                inputElem = <Form.Control type="text" defaultValue={ field.input } onChange={(e) => { handleChangeValue(field.order, e.target.value); }}/>;
                break;
            default:
                inputElem = null;               
        }
        return (
            <Form.Group className="py-1" as={Row} controlId={field.order} key={field.order}>
                <Form.Label column sm="3">{ field.label }</Form.Label>
                <Col sm="9">
                    { inputElem }
                </Col>
            </Form.Group>
        )
    };

    useEffect(() => {
        if (form && show) {
            let result = JSON.parse(form);
            result.fields.sort(compareOrder);
            setFormData(result);
        }
    }, [show]);    

    return (
        <Modal
            size="lg"
            show={show}
            onHide={hide}
            onExited={() => setFormData(null)}
            backdrop="static"
            keyboard={false}
        >
            <Form onSubmit={handleClickSubmit}>
                <Modal.Header closeButton>
                    <Modal.Title>{ formData?.name }</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    { formData?.fields.map(field => toggleFormElement(field)) }
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={hide}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};