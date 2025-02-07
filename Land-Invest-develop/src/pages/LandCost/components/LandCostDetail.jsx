import { Modal } from 'antd';
import React, { memo, useState } from 'react';
import { FaCircleMinus } from 'react-icons/fa6';
import { toVndCurrency } from '../../../function/Payment/toVndCurrency';

const LandCostDetail = ({ item }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="land-cost-description-container">
            <p className="land-cost-detail-stt" onClick={showModal}>
                {item.STT}
            </p>
            {/* <span className="land-cost-detail" ></span> */}
            <Modal
                closable={false}
                footer={<></>}
                open={isModalOpen}
                width={'80vw'}
                centered
                onOk={handleOk}
                onCancel={handleCancel}
                className="land-cost-description-modal"
            >
                <div className="land-const-detail__wrapper">
                    <div className="lant-cost-detail__header">
                        <span></span>
                        <span className="lant-cost-detail__header--title">Chi tiết</span>
                        <FaCircleMinus
                            color="#fff"
                            fontSize={24}
                            className="lant-cost-detail__header--icon"
                            onClick={handleCancel}
                        />
                    </div>
                    <section style={{ marginTop: '10px' }} className="land-cost-table">
                        <table className="land-cost-table_data" border="1">
                            <thead>
                                <tr style={{ height: '40px' }}>
                                    <th>Địa chỉ</th>
                                    <th>Quận huyện</th>
                                    <th>Mô tả</th>
                                    <th>Loại BDS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr style={{ cursor: 'pointer', height: '100px' }}>
                                    <td>{item.address}</td>
                                    <td style={{ textTransform: 'uppercase' }}>{item.district}</td>
                                    <td>{item.description}</td>
                                    <td>{item.landType}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                    <section className="land-cost-detail-info">
                        <div style={{ marginTop: '15px' }} className="auction-detail_box">
                            <div className="auction-detail_box_title">
                                <span style={{ color: 'white' }}>Vị trí 1</span>
                            </div>
                            <div className="auction-detail_box_content">
                                <p>
                                    {Number(item.locationCost[0][`VT1`])
                                        ? toVndCurrency(Number(item.locationCost[0][`VT1`]) * 1000)
                                        : `${item.locationCost[0][`VT1`]}₫`}
                                </p>
                            </div>
                        </div>
                        <div className="auction-detail_box">
                            <div className="auction-detail_box_title">
                                <span style={{ color: 'white' }}>Vị trí 2</span>
                            </div>
                            <div className="auction-detail_box_content">
                                <p>
                                    {Number(item.locationCost[1][`VT2`])
                                        ? toVndCurrency(Number(item.locationCost[1][`VT2`]) * 1000)
                                        : `${item.locationCost[1][`VT2`]}₫`}
                                </p>
                            </div>
                        </div>
                        <div className="auction-detail_box">
                            <div className="auction-detail_box_title">
                                <span style={{ color: 'white' }}>Vị trí 3</span>
                            </div>
                            <div className="auction-detail_box_content">
                                <p style={{ color: '#3DB700' }}>
                                    {' '}
                                    {Number(item.locationCost[2][`VT3`])
                                        ? toVndCurrency(Number(item.locationCost[2][`VT3`]) * 1000)
                                        : `${item.locationCost[2][`VT3`]}₫`}
                                </p>
                            </div>
                        </div>
                        <div className="auction-detail_box">
                            <div className="auction-detail_box_title">
                                <span style={{ color: 'white' }}>Vị trí 4</span>
                            </div>
                            <div className="auction-detail_box_content">
                                <p style={{ color: '#3DB700' }}>
                                    {' '}
                                    {Number(item.locationCost[3][`VT4`])
                                        ? toVndCurrency(Number(item.locationCost[3][`VT4`]) * 1000)
                                        : `${item.locationCost[3][`VT4`]}₫`}
                                </p>
                            </div>
                        </div>
                        <div className="auction-detail_box">
                            <div className="auction-detail_box_title">
                                <span style={{ color: 'white' }}>Vị trí 5</span>
                            </div>
                            <div className="auction-detail_box_content">
                                <p style={{ color: '#3DB700' }}>
                                    {' '}
                                    {Number(item.locationCost[4][`VT5`])
                                        ? toVndCurrency(Number(item.locationCost[4][`VT5`]) * 1000)
                                        : `${item.locationCost[4][`VT5`]}₫`}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            </Modal>
        </div>
    );
};

export default memo(LandCostDetail);
