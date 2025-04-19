import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const LocationUpdateModal = ({ show, handleClose, duAnId }) => {
    const [lat, setLat] = useState("");
    const [lon, setLon] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!lat || !lon || isNaN(lat) || isNaN(lon)) {
            alert("Vui lòng nhập tọa độ hợp lệ!");
            return;
        }

        const formData = new FormData();
        formData.append("location", `${lat}, ${lon}`);

        try {
            setIsLoading(true);
            const response = await fetch(`https://landinvest.thinkdiff.us/edit_location_du_an_bds/${duAnId}`, {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            if (response.ok) {
                alert("Cập nhật vị trí thành công!");
                handleClose();
                setLat("");
                setLon("");
            } else {
                alert(`Lỗi: ${data.message || "Không thể cập nhật vị trí"}`);
            }
        } catch (error) {
            console.error("Lỗi khi cập nhật vị trí:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật vị trí</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Vĩ độ (Latitude)</Form.Label>
                        <Form.Control type="text" value={lat} onChange={(e) => setLat(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Kinh độ (Longitude)</Form.Label>
                        <Form.Control type="text" value={lon} onChange={(e) => setLon(e.target.value)} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Đóng</Button>
                <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default LocationUpdateModal;