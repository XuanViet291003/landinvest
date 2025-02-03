import { message, Radio } from 'antd';
import '../News.scss';
import { useEffect, useState } from 'react';
import { getListAllUser, getListNewUser, getListOnlineUser } from '../../../services/api';
import img from '../../../assets/default-image-user.png';
import { Col, Row } from 'antd';
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
    useEffect(() => {
        (async () => {
            try {
                const newUser = await getListNewUser();
                const onlineUser = await getListOnlineUser();
                const allUser = await getListAllUser();
                setListNewUser(newUser.data);
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
                <table class="table table-striped table-dark" style={{ width: '90%', margin: '20px auto' }}>
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
