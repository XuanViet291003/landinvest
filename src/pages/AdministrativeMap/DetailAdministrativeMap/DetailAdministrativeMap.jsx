import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useParams } from "react-router-dom";

import "./DetailAdministrativeMap.scss";

const DetailAdministrativeMap = () => {
  const { id } = useParams();

  // Khởi tạo dulieu một mảng rỗng
  const [dulieu, setDuLieu] = useState([]);

  // Hàm trả về thông tin bản đồ hành chính quận/huyện
  const getDistrictDetail = async (districtId) => {
    try {
      // Gửi yêu cầu đến API lấy thông tin bản đồ hành chính quận/huyện 
      const response = await fetch(`https://api.quyhoach.xyz/thongtin_wiki_district/${districtId}`);
      const data = await response.json();

      // Nếu có dữ liệu thì trả về, ngược lại trả về null
      return data.dulieu ? data.dulieu : null;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      // Gặp lỗi trả về null
      return null;
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const res = await getDistrictDetail(id);

        // Kiểm tra xem ảnh có phải đang ở dạng Json không
        if (typeof res.images === "string") {
          try {
            res.images = JSON.parse(res.images);
          } catch (error) {
            console.error("Lỗi parse JSON:", error);

            // Nếu lỗi, gán giá trị là mảng rỗng
            res.images = [];
          }
        }

        // Kiểm tra xem Mô Tả có phải đang ở dạng Json không
        if (typeof res.sections === "string") {
          try {
            // Gán sections bằng text Giới Thiệu luôn
            res.sections = JSON.parse(res.sections);

            const sectionKeyMapping = {
              "Giới thiệu": "introduce",
              "Bản đồ vệ tinh": "satelliteMap",
              "Bản đồ giao thông": "trafficMap",
              "Bản đồ quy hoạch": "planningMap",
              "Bản đồ hành chính": "administrativeMap"
            };

            res.sections = Object.keys(res.sections).reduce((acc, key) => {
              const newKey = sectionKeyMapping[key] || key; 
              acc[newKey] = res.sections[key].replace(/\n/g, ' ').trim();
              return acc;
            }, {});
            
            // Kiểm tra kết quả
            console.log(res);
          } catch (error) {
            console.error("Lỗi parse JSON:", error);

            // Nếu lỗi, gán giá trị là object rỗng
            res.sections  = {};
          }
        }

        setDuLieu(res);
      };
    }

    fetchData();
  }, []);

  return (
    <Container>
      {dulieu && (
        <div className='administrative-detail'>
          <div className='administrative-detail__wrap'>
            <div className='administrative-detail__head-title'>
              <h3 className="administrative-detail__title">
                {dulieu.title}
              </h3>
              <p className='administrative-detail__time'>
                {dulieu.updated_at}
              </p>
              <p className='administrative-detail__time'>
                {dulieu.description}
              </p>
            </div>
            <ol className='administrative-detail__sections'>
              <li className='administrative-detail__sections-item'>
                Giới thiệu
              </li>
              <p className='administrative-detail__content'>
                {dulieu.sections?.introduce || "Không có dữ liệu"}
              </p>
              <li className='administrative-detail__sections-item'>
                Bản đồ hành chính
              </li>
              <p className='administrative-detail__content'>
                {dulieu.sections?.administrativeMap || "Không có dữ liệu"}
              </p>
              <img src={dulieu.images && dulieu.images[0]} alt="" />
              <li className='administrative-detail__sections-item'>
                Bản đồ giao thông
              </li>
              <p className='administrative-detail__content'>
                {dulieu.sections?.trafficMap || "Không có dữ liệu"}
              </p>
              <img src={dulieu.images && dulieu.images[1]} alt="" />
              <li className='administrative-detail__sections-item'>
                Bản đồ vệ tinh
              </li>
              <p className='administrative-detail__content'>
                {dulieu.sections?.satelliteMap || "Không có dữ liệu"}
              </p>
              <img src={dulieu.images && dulieu.images[2]} alt="" />
              <li className='administrative-detail__sections-item'>
                Bản đồ quy hoạch
              </li>
              <p className='administrative-detail__content'>
                {dulieu.sections?.planningMap || "Không có dữ liệu"}
              </p>
              <img src={dulieu.images && dulieu.images[3]} alt="" />
            </ol>
          </div>
        </div>
      )}
    </Container>
  );
};

export default DetailAdministrativeMap;