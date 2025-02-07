import { formatDate } from '../../../function/formatDateToYMD';
import { toVndCurrency } from '../../../function/Payment/toVndCurrency';
import TableDescription from '../../elements/TableDescription';
import LandAuctionDetail from '../../LandAuctionModalDetail/LandAuctionDetail';
import HandleGotoLocation from '../components/HandleGotoLocation';

export const columns = [
    {
        title: 'STT',
        dataIndex: 'STT',
        key: 'STT',
        render: (_, item) => <LandAuctionDetail item={item} />,
        width: '30px',
    },
    {
        title: <span className="table-title">Tiêu đề</span>,
        dataIndex: 'Title',
        key: 'Title',
        render: (text) => <TableDescription description={text} />,
        width: '200px',
    },
    {
        title: <span className="table-title">Nơi tổ chức</span>,
        dataIndex: 'AuctionAddress',
        key: 'AuctionAddress',
        render: (text) => <TableDescription description={text} />,
        width: '200px',
    },
    {
        title: <span className="table-title">Mô tả chi tiết</span>,
        key: 'Description',
        dataIndex: 'Description',
        render: (description) => <TableDescription description={description} />,
        width: '250px',
    },
    {
        title: <span className="table-title">Ngày công bố</span>,
        key: 'CreateAt',
        dataIndex: 'CreateAt',
        render: (CreateAt) => {
            return <span>{formatDate(CreateAt)}</span>;
        },
        width: '150px',
    },
    {
        title: <span className="table-title">Ngày đấu giá</span>,
        key: 'EventSchedule',
        dataIndex: 'EventSchedule',
        render: (EventSchedule) => {
            return <span>{formatDate(EventSchedule)}</span>;
        },
        width: '150px',
    },
    {
        title: <span className="table-title">Giá gửi</span>,
        key: 'DepositPrice',
        dataIndex: 'DepositPrice',
        render: (DepositPrice) => {
            return <span>{DepositPrice}</span>;
        },
        width: '180px',
    },
    {
        title: <span className="table-title">Giá sàn</span>,
        key: 'OpenPrice',
        dataIndex: 'OpenPrice',
        render: (OpenPrice) => {
            return <span>{toVndCurrency(OpenPrice)}</span>;
        },
        width: '150px',
    },
    {
        title: <span className="table-title">Vị trí</span>,
        key: 'DistrictID',
        dataIndex: 'DistrictID',
        render: (DistrictID) => {
            return <HandleGotoLocation DistrictID={DistrictID} />;
        },
        width: '200px',
    },
];
