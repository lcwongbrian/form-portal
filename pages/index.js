import { useState, useEffect } from "react";
import useSWR from "swr";
import { Container, Table, Button } from "react-bootstrap";
import EditModal from "@/components/EditModal";
import CreateModal from "@/components/CreateModal";
import { getAllForm, getFormById } from "@/lib/formApi";

export default function Home() {
    const apiPrefix = process.env.NEXT_PUBLIC_FORM_API_URL;
    const [formList, setFormList] = useState(null);
    const [form, setForm] = useState(null);
    const [isShowEditModal, setIsShowEditModal] = useState(false);
    const [isShowCreateModal, setIsShowCreateModal] = useState(false);
    
    const { data, error, isLoading } = useSWR(`${apiPrefix}/form`);

    const handleClickSurvey = async (id) => {
        const searchedForm = await getFormById(id);
        if (searchedForm) {
            setForm(JSON.stringify(searchedForm));
            setIsShowEditModal(true);
        }
    };

    const handleClickCreateForm = () => {
        setIsShowCreateModal(true);
    };

    const handleCloseEditModal = () => setIsShowEditModal(false);
    const handleCloseCreateModal = () => setIsShowCreateModal(false);

    const reload = async () => {
        const data = await getAllForm();
        setFormList(data);
    };

    useEffect(() => {
        if (data && data.length > 0) {
            setFormList(data);
        }
    }, [data]);

    useEffect(() => {
        if (!isShowEditModal || !isShowCreateModal) {
            reload();
        }
    }, [isShowEditModal, isShowCreateModal]);

    return (
        <Container className="mt-4">
            <Button onClick={handleClickCreateForm}>Create New Form</Button>
            <Table responsive="sm">
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Last Updated</th>
                    <th>Edit</th>
                </tr>
                </thead>
                <tbody>
                    { formList && formList.length > 0 && formList.map((form) => (
                        <tr key={form._id}>
                            <td>{ form.name }</td>
                            <td>{ new Date(form.lastUpdate).toString() }</td>
                            <td><Button size="sm" onClick={e => { handleClickSurvey(form._id); }}>Survey</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <EditModal form={form} show={isShowEditModal} hide={handleCloseEditModal} />
            <CreateModal form={form} show={isShowCreateModal} hide={handleCloseCreateModal} />
        </Container>
    );
}
