import { message, Radio, Spin } from 'antd';
import '../News.scss';
import { useEffect, useState } from 'react';
import { getListAllUser, getListNewUser, getListOnlineUser } from '../../../services/api';
import img from '../../../assets/default-image-user.png';
import { Col, Row } from 'antd';
import ReactPaginate from 'react-paginate';
const options = [
    {
        label: 'Người dùng mới',
        value: 1,
    },
    {
        label: 'Người đang hoạt động',
        value: 2,
    },
    {
        label: 'Tất cả người dùng',
        value: 3,
    },
];
const convertTime = (string) => {
    const date = new Date(string);
    const PostTime = `${date.getHours()}:${date.getMinutes()}  ${date.getDate()}/${
        date.getMonth() + 1
    }/${date.getFullYear()}`;
    return PostTime;
};
function Follow() {
    const [ListNewUser, setListNewUser] = useState([]);
    const [listOnlineUser, setListOnlineUser] = useState([]);
    const [listAllUser, setListAllUser] = useState([]);
    const [option, setOption] = useState(1);
    const [totalPage, setTotalPage] = useState();
    const [loading, setLoading] = useState(false);
    const handleChangePage = async (e) => {
        setLoading(true);
        try {
            const newUser = await getListNewUser(e.selected + 1);
            setListNewUser(newUser.data);
        } catch {
            message.error('Đã có lỗi xảy ra !');
        }
        setLoading(false);
    };
    useEffect(() => {
        (async () => {
            try {
                const newUser = await getListNewUser();
                const onlineUser = await getListOnlineUser();
                const allUser = await getListAllUser();
                setListNewUser(newUser.data);
                setTotalPage(Math.ceil(newUser.total_page));
                setListOnlineUser(onlineUser.OnlineUsers);
                setListAllUser(allUser);
            } catch {
                message.error('Đã có lỗi xảy ra !');
            }
        })();
    }, []);
    const handleChange = (e) => {
        setOption(e.target.value);
    };
    return (
        <div className="follow-page">
            <Radio.Group
                className="custom-radio"
                block={true}
                options={options}
                defaultValue={1}
                optionType="button"
                buttonStyle="solid"
                onChange={handleChange}
            />
            {option == 1 && (
                <>
                    <ReactPaginate
                        containerClassName="pagination-news mt-3"
                        previousLabel="< Trước"
                        nextLabel="Sau >"
                        breakLabel="..."
                        pageCount={totalPage}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        onPageChange={handleChangePage}
                        activeClassName="pagination-news--active"
                    />
                    <Spin size="large" spinning={loading}>
                        <table class="table table-striped table-dark" style={{ width: '90%', margin: '5px auto' }}>
                            <thead>
                                <tr>
                                    <th scope="col">STT</th>
                                    <th scope="col">Họ tên</th>
                                    <th scope="col">Ngày hoạt động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {option == 1 &&
                                    ListNewUser.map((item, index) => (
                                        <tr span={6} key={'user-new' + item.userid}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{item.FullName}</td>
                                            <td>{convertTime(item.LastActivityTime)}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </Spin>
                </>
            )}
            <Row className="list-user" gutter={[20, 20]}>
                {option == 3 &&
                    listAllUser.map((item) => (
                        <Col className="list-user-item" span={6} key={'user-new' + item.userid}>
                            <img src={item.avatarLink || img} alt="Avatar" className="list-user-item__avatar" />
                            <p className="list-user-item__name">{item.FullName}</p>
                        </Col>
                    ))}
                {option == 2 && !listOnlineUser?.count_online && <p className="notify-user">Chưa có ai online !</p>}
            </Row>
        </div>
    );
}

export default Follow;
