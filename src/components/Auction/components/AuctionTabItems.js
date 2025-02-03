import { TAB_KEYS } from '../../../constants/LandAuctionKey';
import AuctionsListRender from './AuctionsListRender';

export const items = [
    {
        key: TAB_KEYS.ALL,
        label: 'Danh sách tất cả đấu giá',
        children: <AuctionsListRender />,
    },
    {
        key: TAB_KEYS.FILTER,
        label: 'Lọc',
        children: <AuctionsListRender />,
    },
];
