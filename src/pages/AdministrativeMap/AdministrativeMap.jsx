import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";

import "./AdministrativeMap.scss";

const AdministrativeMap = () => {
  // Khởi tạo dulieu một mảng rỗng
  const [dulieu, setDuLieu] = useState([]);

  const [searchParams] = useSearchParams();
  // Lấy location từ vitri truyền qua url
  const provinceId = searchParams.get("provinceId");

  // Hàm lấy danh sách các quận/huyên theo mã tỉnh/thành phố
  const getDistrictByProvinceId = async (provinceId) => {
    try {
      // Gửi yêu cầu đến API lấy danh sách quận/huyện 
      const response = await fetch(`https://api.quyhoach.xyz/list_districts_in_provinces/${provinceId}`);
      const data = await response.json();

      // Nếu có dữ liệu thì trả về, ngược lại trả về null
      return data.dulieu ? data.dulieu : null;
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu:', error);
      // Gặp lỗi trả về null
      return null;
    }
  }

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
      if (provinceId) {
        const districts = await getDistrictByProvinceId(provinceId);

        if (districts && districts.length > 0) {
          const data = [];
          for (const item of districts) {
            const res = await getDistrictDetail(item.DistrictID);

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
                res.sections = JSON.parse(res.sections)["Giới thiệu"];
              } catch (error) {
                console.error("Lỗi parse JSON:", error);

                // Nếu lỗi, gán giá trị là mảng rỗng
                res.sections = [];
              }
            }

            // Kiểm tra xem HOOK_ID có phải đang ở dạng Json không
            if (typeof res.HOOK_ID === "string") {
              try {
                res.HOOK_ID = JSON.parse(res.HOOK_ID);
              } catch (error) {
                console.error("Lỗi parse JSON:", error);

                // Nếu lỗi, gán giá trị là object rỗng
                res.HOOK_ID = {};
              }
            }

            data.push(res);

            // Chỉ lấy tối đa 10 bản ghi
            if (data.length === 10) break;
          }
          if (data && data.length > 0) {
            setDuLieu(data);
          }
        }
      }
    };

    fetchData();
  }, []);

  // Hàm chuyển đổi giờ sang giờ Việt Nam
  const convertToVietnamTime = (gmtString) => {
    // Chuyển đổi chuỗi ngày tháng từ GMT sang đối tượng Date
    let date = new Date(gmtString);

    // Cấu hình cho múi giờ Việt Nam (GMT+7)
    let options = {
      weekday: 'long', // Hiển thị thứ (Thứ Hai, Thứ Ba, ...)
      day: 'numeric', // Hiển thị ngày
      month: 'long', // Hiển thị tháng (Tháng 1, Tháng 2, ...)
      year: 'numeric', // Hiển thị năm
      hour: '2-digit', // Giờ có 2 chữ số
      minute: '2-digit', // Phút có 2 chữ số
      second: '2-digit', // Giây có 2 chữ số
      timeZone: 'Asia/Ho_Chi_Minh' // Múi giờ Việt Nam
    };

    // Chuyển đổi sang chuỗi ngày giờ theo định dạng tiếng Việt
    return date.toLocaleString('vi-VN', options);
  }

  return (
    <Container>
      <div style={{ marginBottom: "100px" }}>
        {dulieu ? (
          dulieu.map((item, index) => (
            <div className="map-list" key={index}>
              <div className="map-list__item">
                <img
                  src={item.images && item.images[0]}
                  alt="Bản đồ Tỉnh Gia Lai"
                  className="map-list__item-image"
                />
                <div className="map-list__item-info">
                  <h3 className="map-list__item-title">{item.title}</h3>
                  <p className="map-list__item-description">
                    {item.sections}
                  </p>
                  <div className="map-list__item-date-created">🕑 {convertToVietnamTime(item.updated_at)}</div>
                  <Link to={`/administrative-maps/${item.HOOK_ID.DistrictID}`} className="map-list__item-link">
                    Xem chi tiết
                  </Link>

                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: "white" }}>
            Không có dữ liệu
          </div>
        )}
      </div>
    </Container>
  );
};

export default AdministrativeMap;