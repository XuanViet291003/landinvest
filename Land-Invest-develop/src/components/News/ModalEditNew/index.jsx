import { Button, Form, Input, message, Modal, Upload } from 'antd';
import { memo, useEffect, useState } from 'react';
import { editNews } from '../../../services/api';
import Editor from '../ModalCreateNew/Editor';
import { UploadOutlined } from '@ant-design/icons';
function ModalEditNew({ isShowModalEdit, setIsShowModalEdit, news, setArticles }) {
    const [loading, setLoading] = useState(false);
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [fileList, setFileList] = useState();
    const [removeImage, setRemoveImage] = useState('');
    const props = {
        multiple: true,
        accept: 'image/*',
        beforeUpload: (file) => {
            return false;
        },
        onRemove: (file) => {
            const check = news.images.find((item) => {
                return item.link_image === file.url;
            });
            if (check) {
                setRemoveImage(removeImage ? check.link_image : `${removeImage}|${check.link_image}`);
            }
        },
    };
    const handleFinish = async () => {
        setLoading(true);
        const formData = new FormData();
        fileList?.forEach((file) => {
            formData.append('Images', file.originFileObj);
        });
        formData.append('Title', title);
        formData.append('Content', content);
        formData.append('remove_image', removeImage);
        try {
            const res = await editNews(news.id, formData);
            console.log('res', res);
            if (res) {
                setIsShowModalEdit(false);
                message.success('Sữa thành công !');
                setArticles((pre) => {
                    const newState = [...pre];
                    newState.forEach((item, index) => {
                        if (item.PostID === news.id) {
                            newState[index] = {
                                ...newState[index],
                                Content: content,
                                Title: title,
                                Images: res[0].Images,
                            };
                        }
                    });
                    return newState;
                });
            } else {
                message.error('Sửa thất bại !');
            }
        } catch (err) {
            message.error('Sửa thất bại !');
            console.log(err);
        }
        setLoading(false);
    };
    useEffect(() => {
        setContent(news.content);
        setTitle(news.title);
        setFileList(news.images?.map((item) => ({ url: item.link_image })));
    }, [news]);
    return (
        <Modal
            width={1000}
            open={isShowModalEdit}
            onCancel={() => setIsShowModalEdit(false)}
            footer={null}
            title="Sửa bài viết"
            destroyOnClose
        >
            <Form.Item label="Tiêu đề :">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Item>
            <Editor content={content} setContent={setContent} />
            <Form.Item label="Hình ảnh :" style={{ marginTop: '20px' }}>
                <Upload
                    {...props}
                    listType="picture-card"
                    onPreview={() => {}}
                    fileList={fileList}
                    onChange={(newFiles) => {
                        setFileList(newFiles.fileList);
                    }}
                >
                    <UploadOutlined style={{ fontSize: '30px', opacity: '0.7' }} />
                </Upload>
            </Form.Item>
            <Form.Item>
                <Button onClick={handleFinish} loading={loading} disabled={loading} type="primary">
                    Hoàn tất
                </Button>
            </Form.Item>
        </Modal>
    );
}

export default memo(ModalEditNew);
