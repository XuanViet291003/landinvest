import {toVndCurrency} from '../../../function/Payment/toVndCurrency';
import LandCostDescription from './LandCostDescription';
import LandCostDetail from './LandCostDetail';

export const columns = [
    {
        title: 'STT',
        dataIndex: 'STT',
        key: 'STT',
        render: (_, item) => <LandCostDetail item={item}/>,
        width: '30px',
    },
    {
        title: <span className="table-title">Quận Huyện</span>,
        dataIndex: 'district',
        key: 'district',
        render: (text) => <LandCostDescription description={text} oneLine/>,
        width: '130px',
    },
    {
        title: (
            <span className="table-title">
            Đường<span className="table-source">/</span>làng xã
        </span>
        ),
        dataIndex: 'address',
        key: 'address',
        render: (text) => (
            text ? (
                <span className="land-cost-address">
                <LandCostDescription description={text} oneLine/>
            </span>
            ) : null
        ),
        width: '200px',
        onCell: (record) => ({
            style: !record.address ? {display: 'none'} : {}
        })
    },
    {
        title: <span className="table-title">Mô tả chi tiết</span>,
        key: 'description',
        dataIndex: 'description',
        render: (description) => <LandCostDescription description={description} oneLine/>,
        width: '150px',
    },
    {
        title: <span className="table-title">VT1</span>,
        key: 'VT1',
        dataIndex: 'VT1',
        render: (_, {locationCost}) => {
            const VT1 = Number(locationCost[0][`VT1`])
                ? toVndCurrency(Number(locationCost[0][`VT1`]) * 1000)
                : `${locationCost[0][`VT1`]}₫`;

            return <span>{VT1}</span>;
        },
        width: '100px',
    },
    {
        title: <span className="table-title">VT2</span>,
        key: 'VT2',
        dataIndex: 'VT2',
        render: (_, {locationCost}) => {
            const VT2 = Number(locationCost[1][`VT2`])
                ? toVndCurrency(Number(locationCost[1][`VT2`]) * 1000)
                : `${locationCost[1][`VT2`]}₫`;
            return <span>{VT2}</span>;
        },
        width: '120px',
    },
    {
        title: <span className="table-title">VT3</span>,
        key: 'VT3',
        dataIndex: 'VT3',
        render: (_, {locationCost}) => {
            const VT3 = Number(locationCost[2][`VT3`])
                ? toVndCurrency(Number(locationCost[2][`VT3`]) * 1000)
                : `${locationCost[2][`VT3`]}₫`;
            return <span>{VT3}</span>;
        },
        width: '120px',
    },
    {
        title: <span className="table-title">VT4</span>,
        key: 'VT4',
        dataIndex: 'VT4',
        render: (_, {locationCost}) => {
            const VT4 = Number(locationCost[3][`VT4`])
                ? toVndCurrency(Number(locationCost[3][`VT4`]) * 1000)
                : `${locationCost[3][`VT4`]}₫`;
            return <span>{VT4}</span>;
        },
        width: '120px',
    },
    {
        title: <span className="table-title">VT5</span>,
        key: 'VT5',
        dataIndex: 'VT5',
        render: (_, {locationCost}) => {
            const VT5 = Number(locationCost[4][`VT5`])
                ? toVndCurrency(Number(locationCost[4][`VT5`]) * 1000)
                : `${locationCost[4][`VT5`]}₫`;
            return <span>{VT5}</span>;
        },
        width: '120px',
    },
    {
        title: <span className="table-title">Loại BDS</span>,
        key: 'landType',
        dataIndex: 'landType',
        render: (text) => <span className="land-cost-landType">{text}</span>,
        width: '80px',
    },
];
