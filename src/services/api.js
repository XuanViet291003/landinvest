import removeAccents from 'remove-accents';
import instance, { payOsInstance,thinkDiffInstance ,thinkDiffus } from '../utils/axios-customize';
import { Await } from 'react-router-dom';
import axios from 'axios';
// api login, logout
export const callLogin = (Username, Password, LastLoginIP) => {
    const params = {
        Username: Username,
        Password: Password,
        LastLoginIP,
    };
    return instance.post('/api/login', params);
};
export const callLogout = (Username, Password) => {
    const params = {
        Username: Username,
        Password: Password,
    };console.log('User pas:', params);
    return instance.post('/api/logout', params);
};

// api register
export const callRegister = (
    Username,
    Fullname,
    Password,
    Gender,
    Latitude,
    Longitude,
    AvatarLink,
    ipAddress,
    Email,
) => {
    const payload = {
        Username: Username,
        FullName: Fullname,
        Password: Password,
        Gender: Gender,
        Latitude: Latitude,
        Longitude: Longitude,
        avatarLink: AvatarLink,
        Email: Email,
        LastLoginIP: ipAddress,
    };

    return instance
        .post('api/register', payload)
        .then((response) => response.data)
        .catch((error) => {
            if (error.response) {
                console.error('Error Response Data:', error.response.data);
            }
            throw error;
        });
};

// api token
export const callRefeshToken = () => {
    return instance.post('/refresh_token');
};

export const callforgotPassword = (email) => {
    return instance.post('api/forgotPassword', {
        Email: email,
    });
};

//api search quy hoạch

export const searchQueryAPI = (query) => {
    return instance.get(`/zonings/view?name=${encodeURIComponent(query)}`);
};

// api box
export const ViewlistBox = () => {
    return instance.get('/box/viewlist_box');
};
export const CreateBox = (BoxName, Description, avatarLink) => {
    return instance.post('/box/add_box', { BoxName, Description, avatarLink });
};

export const UpdateBox = (BoxID, BoxName, Description, avatarLink) => {
    return instance.patch(`/box/update_box/${BoxID}`, { BoxName, Description, avatarLink });
};

// API Map

export const fetchAllQuyHoach = async () => {
    try {
        const { data } = await instance.get('/all_quyhoach');
        return data;
    } catch (error) {
        console.error('Error fetching all quy hoach: ', error);
        return [];
    }
};

export const fetchKeHoachsdd = async () => {
    try {
        const { data } = await instance.get('/lietke_ke_hoach_sdd_truoc_2030');
        return data[0].quyhoach;
    } catch (error) {
        console.error('Error fetching all quy hoach: ', error);
        return [];
    }
};
export const fetchQuyHoachTinh = async () => {
    try {
        const { data } = await instance.get('/lietke_quyhoach_tinh');
        return data[0].quyhoach;
    } catch (error) {
        console.error('Error fetching all quy hoach: ', error);
        return [];
    }
};

export const fetchQuyHoachXayDung = async () => {
    try {
        const { data } = await instance.get('/lietke_quyhoach_xaydung');
        return data[0].quyhoach;
    } catch (error) {
        console.error('Error fetching all quy hoach: ', error);
        return [];
    }
};

export const fetchQuyHoachDiaChinh = async () => {
    try {
        const { data } = await instance.get('/lietke_quyhoach_diachinh');
        return data[0].quyhoach;
    } catch (error) {
        console.error('Error fetching all quy hoach: ', error);
        return [];
    }
};

export const fetchQuyHoach2030 = async () => {
    try {
        const { data } = await instance.get('/lietke_quyhoach_sdd_2030');

        return data[0].quyhoach;
    } catch (error) {
        console.error('Error fetching all quy hoach: ', error);
        return [];
    }
};

export const fetchQuyHoach1500 = async () => {
    try {
        const { data } = await instance.get('/lietke_1_500_du_an');
        return data[0].quyhoach;
    } catch (error) {
        console.error('Error fetching all quy hoach: ', error);
        return [];
    }
};

export const fetchProvinces = async () => {
    try {
        const response = await instance.get('/provinces/view/');
        return response.data;
    } catch (error) {
        console.error('Error fetching provinces: ', error);
        return [];
    }
};

export const fetchListInfo = async (idDistrict) => {
    try {
        const { data } = await instance.get(`/location/list_info_by_district/${idDistrict}`);
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const fetchAllProvince = async () => {
    try {
        const { data } = await instance.get('/provinces/view/');
        return data;
    } catch (error) {
        console.error('Error fetching provinces: ', error);
        return [];
    }
};

export const fetchDistrictsByProvinces = async (ProvinceID) => {
    try {
        const { data } = await instance.get(`/districts/Byprovince/${ProvinceID}`);
        return data;
    } catch (error) {
        console.error('Error fetching districts', error);
        return;
    }
};

export const fetQuyHoachByIdDistrict = async (districtId) => {
    try {
        const { data } = await instance.get(`/quyhoach1quan/${districtId}`);
        return data;
    } catch (error) {
        console.error('Error fetching quy hoach by district:', error);
        return [];
    }
};

export const searchLocation = async (districtName) => {
    try {
        let apiName = removeAccents(districtName?.toLowerCase());
        if (apiName === 'south tu liem') {
            apiName = 'nam tu liem';
        } else if (apiName === 'north tu liem') {
            apiName = 'bac tu liem';
        }

        const { data } = await instance.get(`/quyhoach/search/${apiName}`);
        return data?.Posts[0];
    } catch (error) {
        console.error('Error fetching location data:', error);
        throw error;
    }
};

//Api Auction

export const fetchListHighestLocation = async (districtId) => {
    try {
        const response = await instance.get(`location/list_info_highest/${districtId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching districts', error);
        return;
    }
};

export const fetchFilteredAuctions = async (startTime, endTime, startPrice, endPrice, province, district) => {
    const params = {
        StartTime: startTime,
        EndTime: endTime,
        Province: province,
        District: district,
        StartPrice: startPrice,
        EndPrice: endPrice,
    };
    const response = await instance.post('/landauctions/filter_auction', params);
    return response.data;
};

export const fetchAuctionInfor = async (LandAuctionID) => {
    const response = await instance.get(`/landauctions/view/${LandAuctionID}`);
    return response.data;
};

export const fetchOrganization = async () => {
    const response = await instance.get('/list_organizers');
    return response.data;
};

export const fetchCreateComment = async (IDAuction, comment, userId) => {
    const params = {
        idUser: userId,
        content: comment,
    };
    const response = await instance.post(`/landauctions/create_comment/${IDAuction}`, params);
    return response.data;
};

//api list comment
export const fetchListComment = async (IDAuction) => {
    const response = await instance.get(`/landauctions/list_comment/${IDAuction}`);
    return response.data;
};

//api edit comment
export const EditCommentAuction = async (IDComment, EditComment) => {
    const params = {
        content: EditComment,
    };
    const response = await instance.patch(`/landauctions/edit_comment/${IDComment}`, params);
    return response.data;
};
//api delete comment
export const DeleteCommentAuction = async (IDComment) => {
    const response = await instance.delete(`/landauctions/delete_comment/${IDComment}`);
    return response.data;
};

//forums post

export const ViewlistPost = () => {
    return instance.get('/forum/view_allpost');
};

export const CreatePost = (GroupID, Title, Content, PostLatitude, PostLongitude, base64Images, isHastags) => {
    const params = {
        GroupID: GroupID,
        Title: Title,
        Content: Content,
        PostLatitude: PostLatitude,
        PostLongitude: PostLongitude,
        Images: base64Images,
        Hastags: isHastags,
    };
    return instance.post('/forum/add_post', params);
};
export const UpdatePost = (PostID, Title, Content) => {
    return instance.patch(`/forum/update_post/${PostID}`, { Title, Content });
};

// export const callFetchPostById = (PostID) => {
//     return instance.get(`/api/forum/view_post/${PostID}`);
// };
export const DeletePost = (PostID) => {
    return instance.delete(`/forum/delete_post/${PostID}`);
};

// api like, comment, share

export const LikePost = (idUser, idPost) => {
    return instance.post(`/forum/like_post/${idUser}/${idPost}`);
};

export const ListUserLike = (idPost) => {
    return instance.get(`/forum/list_user_like_post/${idPost}`);
};
export const numberInteractions = (idPost) => {
    return instance.get(`/forum/number_info_post/${idPost}`);
};
export const AllPostInfor = () => {
    return instance.get('/forum/all_post_info');
};

// api comment post
export const ViewlistComment = (PostID) => {
    return instance.get(`/post/comments/${PostID}`);
};
export const CreateComment = (PostID, Content, Images) => {
    return instance.post(`/post/add_comment/${PostID}`, { Content, Images });
};
export const UpdateComment = (CommentID, Content, PhotoURL) => {
    return instance.patch(`/post/comment/update/${CommentID}`, { Content, PhotoURL });
};
export const DeleteComment = (CommentID) => {
    return instance.delete(`/post/comment/remove/${CommentID}`);
};

// api group
export const CreateGroup = (BoxID, GroupName, avatarLink) => {
    return instance.post('/group/add_group', { BoxID, GroupName, avatarLink });
};

export const UpdateGroup = (GroupID, GroupName) => {
    return instance.patch(`/group/update_group/${GroupID}`, { GroupName });
};
export const DeleteGroup = (GroupID) => {
    return instance.delete(`/group/remove_group/${GroupID}`);
};
export const ViewlistGroup = (BoxID) => {
    return instance.get(`/group/all_group/${BoxID}`);
};

// api user, checkonline
export const callGetAllUsers = () => {
    return instance.get(`/api/listalluser`);
};
export const ViewProfileUser = (USERID) => {
    return instance.get(`/private/profile/${USERID}`);
};
export const CheckUserOnline = (USERID) => {
    return instance.get(`/checkOnline/${USERID}`);
};
export const BlockUserPost = (USERID) => {
    return instance.patch(`/forum/block_user/${USERID}`);
};
export const UpdateProfileUser = (updatedUserData) => {
    return instance.patch('/profile/updateprofile', updatedUserData);
};

//api account
export const fetchAccount = async () => {
    const response = await instance.get('/api/listalluser');
    return response.data;
};

export const getUserCoins = async (id) => {
    const response = await instance.get(`api/get_user_by_userid/${id}`);
    return response.data;
};

//

export const getALLPlansByProvince = async () => {
    const response = await instance.get('/all_tinh_quyhoach');
    return response.data;
};
export const getAllPlansDetails = async () => {
    const response = await instance.get('/sap_xep_tinh_quan_huyen');
    return response.data;
};
export const getAllPlansDetailsByProvineId = async (id) => {
    const response = await instance.get(`/sap_xep_cac_huyen/${id}`);
    return response.data;
};

// this route can be use to get image,360 video and get marker in boudingbox
export const getAllImageInBoundingBox = async (southwest, northeast) => {
    const sLat = southwest.lat;
    const sLng = southwest.lng;
    const nLat = northeast.lat;
    const nLng = northeast.lng;

    const res = await instance.get(`/get_list_image_bound/${sLng}/${sLat}/${nLng}/${nLat}`);
    return res.data;
};
export const getLocationInBoudingBox = async (lat, lng) => {
    const res = await instance.get(`get_district_provinces/${lat}/${lng}`);
    return res.data;
};
export const getListRegulations = async (southwest, northeast) => {
    const sLat = southwest.lat.toFixed(6);
    const sLng = southwest.lng.toFixed(6);
    const nLat = northeast.lat.toFixed(6);
    const nLng = northeast.lng.toFixed(6);

    const res = await instance.get(`/get_list_quyhoach_bound/${sLng}/${sLat}/${nLng}/${nLat}`);
    return res.data;
};
export const postImageLocation = async (image) => {
    const res = await instance.patch('/add_image_get_link_nginx/10', image);
    return res.data;
};
export const postUploadImage = async (lat, lng, image) => {
    const res = await instance.post(`/add_image_location/${lat}/${lng}`, image);
    return res.data;
};

export const deleteGulandOnTileLayer = async (plansId, zoom, x, y) => {
    const res = await instance.post(`xoa_quyhoach_theo_tinh/${plansId}/${zoom}/${x}/${y}`);
    return res.data;
};
export const getAreaLocation = async (lat, lng) => {
    const response = await instance.get(`thongtindiachinh/${lat}/${lng}`);
    return response.data;
};
export const listAuctionsInfor = async (page = 1, limit = 5) => {
    const res = await instance.get(`/daugia/thongtin?page=${page}&limit=${limit}`);
    return res.data;
};
export const createCheckoutInfo = async (data) => {
    const res = await instance.post('buycoin_viewquyhoach', data);
    return res.data;
};

export const getCheckoutInfo = async (id) => {
    const res = await payOsInstance.get(`v2/payment-requests/${id}`);
    return res.data;
};

export const createCheckout = async (data) => {
    const res = await payOsInstance.post(`v2/payment-requests`, data);
    return res.data;
};

export const cancelCheckout = async (id) => {
    const res = await payOsInstance.post(`v2/payment-requests/${id}/cancel`);
    return res.data;
};
export const getUrlMapLayer = async (z, x, y) => {
    const res = await instance.get(`get_dung_duong_dan_xoa_anh/${z}/${x}/${y}`);
    return res.data;
};

export const getImageMapLayer = async (id, z, x, y) => {
    const res = await instance.get(`get_quyhoach_theo_tinh/${id}/${z}/${x}/${y}`);
    return res.data;
};
export const getBoxNews = async () => {
    const res = await instance.get(`api/box/viewlist_box`);
    return res.data;
};
export const getGroupByBoxId = async (BoxID) => {
    const res = await instance.get(`api/group/all_group/${BoxID}`);
    return res.data;
};
export const getGroupByPage = async (id, page) => {
    const res = await instance.get(`api/forum/group/${id}?page=${page}`);
    return res.data;
};
export const postNews = async (data, token) => {
    const res = await instance.post(`api/forum/add_post`, data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
};
export const editNews = async (PostID, data) => {
    const res = await instance.patch(`api/forum/update_post/${PostID}`, data);
    return res.data;
};
// bảng giá đất
export const getAllProvinces = async () => {
    const res = await instance.get(`all_provinces`);
    return res.data;
};
export const getAllLandCost = async () => {
    const res = await instance.get(`bang_gia_dat_all`);
    return res.data;
};
export const getAllLandCostInProvince = async (id) => {
    const res = await instance.get(`bang_gia_dat_province/${id}`);
    return res.data;
};
export const getAllLandCostInDistrict = async (id) => {
    const res = await instance.get(`bang_gia_dat_district/${id}`);
    return res.data;
};
export const getAllLDistrictsInProvince = async (id) => {
    const res = await instance.get(`list_districts_in_provinces/${id}`);
    return res.data;
};
export const getAllLocalitiesInDistrict = async (id) => {
    const res = await instance.get(`list_xa_phuong_in_districts/${id}`);
    return res.data;
};
export const getAllLandCostInLocality = async (id) => {
    const res = await instance.get(`bang_gia_dat_xa_phuong/${id}`);
    return res.data;
};

export const getWardPolygon = async (id) => {
    const res = await instance.get(`get_polygon_xa_phuong/${id}`);
    return res.data.duongdan[0];
};
//comment
export const getCommentsByIdPost = async (id, page) => {
    const res = await instance.get(`api/forum/list_comment_post/${id}?page=${page}`);
    return res.data;
};
//Dữ liệu đột biến hạ tầng



export const searchLandCostByTextApi = async (searchText) => {
    try {
        const res = await instance.get(`/search_bang_gia_dat/${searchText}`);
        return res.data.dulieu;
    } catch (error) {
        console.error('Error searching bid plans:', error);
        throw error;
    }
};


export const getBidPlansByDistrictApi = async (districtId) => {
    try {
        const id = parseInt(districtId);
        if (isNaN(id) || id <= 0) {
            throw new Error('Mã quận/huyện không hợp lệ');
        }

        const res = await thinkDiffus.get(`/dotbien-hatang/${id}.json`);
        console.log(`Raw bid plans response for district ${id}:`, res.data.projects);

        if (!res.data.projects) {
            throw new Error(`Không có dữ liệu trả về cho quận/huyện ${id}`);
        }

        if (!Array.isArray(res.data.projects)) {
            throw new Error(`Dữ liệu trả về không chứa danh sách kế hoạch hợp lệ cho quận/huyện ${id}`);
        }

        if (res.data.DistrictID !== id) {
            throw new Error(`Dữ liệu trả về không khớp với mã quận/huyện ${id}`);
        }

        return res.data.projects; // Trả về mảng projects thay vì object
    } catch (error) {
        console.error(`Error fetching bid plans for district ${districtId}:`, {
            message: error.message,
            response: error.response ? error.response.data : null,
            status: error.response ? error.response.status : null,
        });
        throw error;
    }
};

export const searchBidPlansByTextApi = async (searchText) => {
    try {
        const res = await instance.get(`/dbht_search_text/${searchText}`);
        return res.data;
// =======
// //text search dot bien ha tang
// export const searchBidPlansByTextApi = async (searchText) => {
//     try {
//         const res = await instance.get(`https://api.quyhoach.xyz/dbht_search_text/${searchText}`);
//         console.log('Raw search bid plans response:', res);
//         if (!Array.isArray(res.data)) {
//             throw new Error('Dữ liệu trả về không phải là mảng');
//         }
//         return res.data; 
// >>>>>>> Stashed changes
    } catch (error) {
        console.error('Error searching bid plans:', error);
        throw error;
    }
};

export const getAllLandAutions = async (page) => {
    const res = await instance.get(`api/daugia/thongtin`, {
        params: {
            page: page,
        },
    });
    return res.data;
};
export const getAllLandAutionsByUBND = async (page) => {
    const res = await instance.get(`api/daugia/bds_ubnd`, {
        params: {
            page: page,
        },
    });
    return res.data;
};
export const searchLandAutions = async (formData, page) => {
    const res = await instance.post(`api/daugia/timkiem`, formData, {
        params: {
            page,
        },
    });
    return res.data;
};
export const getLandAuctionsTypes = async () => {
    const res = await instance.get(`api/daugia/list_type_dau_gia`);
    return res.data;
};
export const postComment = async (userId, postId, data) => {
    const res = await instance.post(`api/forum/comment_post/${userId}/${postId}`, data);
    return res.data;
};
export const fetchAllListProject = async (page) => {
    const res = await instance.get(`/list_all_du_an?page=${page}`);
    return res.data;
};
export const getAllDetail = async (projectId) => {
    const res = await instance.get(`/detail_du_an/${projectId}`);
    return res.data;
};
export const getPostByUserId = async (userId, page) => {
    const res = await instance.get(`api/forum/list_all_post_by_user/${userId}/${page}`);
    return res.data;
};
export const getListTag = async () => {
    const res = await instance.get(`api/forum/sort_hashtag/0`);
    return res.data;
};
export const getLatestPost = async () => {
    const res = await instance.get(`api/forum/view_sort_1day`);
    return res.data;
};
export const getOldPost = async () => {
    const res = await instance.get(`api/forum/view_allpost_sort_timeview_count/1`);
    return res.data;
};
export const getLatestNew = async (page) => {
    const res = await instance.get(`api/forum/get_list_new_post?page=${page}`);
    return res.data;
};
export const getListNewUser = async (page = 1) => {
    const res = await instance.get(`api/list_new_user?page=${page}`);
    return res.data;
};
export const getListOnlineUser = async () => {
    const res = await instance.get('api/check_online_all');
    return res.data;
};
export const getListAllUser = async () => {
    const res = await instance.get('api/listalluser');
    return res.data;
};
export const searchPost = async (value, page = 1) => {
    const res = await instance.get(`api/forum/search/${value}?page=${page}`);
    return res.data;
};
export const getDetaitPostById = async (id) => {
    const res = await instance.get(`api/forum/view_post/${id}`);
    return res.data;
};
export const getLocationByProvince = async (id) => {
    const res = await instance.get(`get_provinces_to_boundingbox/${id}`);
    return res.data;
};
export const getLocationByDistrict = async (id) => {
    const res = await instance.get(`get_districts_to_boundingbox/${id}`);
    return res.data;
};
export const getDistrictAndProvinceByLocation = async (lat, lng) => {
    const res = await instance.get(`get_districts_provinces_by_location/${lat}/${lng}`);
    return res.data;
};
export const getAllWandInDistrict = async (id) => {
    const res = await instance.get(`get_tat_ca_xa_1_huyen/${id}`);
    return res.data;
};
export const getAllDistrictInProvince = async (id) => {
    const res = await instance.get(`get_tat_ca_huyen_1_tinh/${id}`);
    return res.data;
};
export const getListSearchInvestor = async (key, page = 1) => {
    const res = await instance.get(`list_nhadautu_search/${key}?page=${page}`);
    return res.data;
};
export const postPolyGonForDuAn = async (id, value) => {
    const res = await instance.post(`edit_polygon_du_an_bds/${id}`, value);
    return res.data;
};
export const getListNewsByIdUser = async (id, page = 1) => {
    const res = await instance.get(`/forum/list_all_post_by_user/${id}/${page}`);
    return res.data;
};
export const getDataUserById = async (id) => {
    const res = await instance.get(`/profile/other_user/${id}`);
    return res.data;
};
