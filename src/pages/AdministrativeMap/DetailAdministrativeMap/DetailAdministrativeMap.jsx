import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

import "./DetailAdministrativeMap.scss";

const DetailAdministrativeMap = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State lưu dữ liệu bản đồ
  const [dulieu, setDuLieu] = useState(null);

  // Hàm lấy dữ liệu từ API
  const getDistrictDetail = async (districtId) => {
    try {
      const response = await fetch(`https://api.quyhoach.xyz/thongtin_wiki_district/${districtId}`);
      const data = await response.json();
      return data.dulieu || null;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      return null;
    }
  };

  const extractIntroduceData = (data) => {
    const sections = data.split("\n");
    const titles = ["Vị trí địa lý", "Diện tích và dân số", "Cơ sở hạ tầng"];
    const introduce = {};

    console.log(sections)

    let currentKey = "intro";
    introduce[currentKey] = "";

    sections.forEach(line => {

      if (titles.includes(line.trim())) {
        currentKey = line.trim();
        introduce[currentKey] = { title: line.trim(), details: "" };
        console.log(introduce[currentKey])
      } else {
        if (currentKey === "intro") {
          introduce.intro += line + " ";
        } else {
          introduce[currentKey].details += line + "\n";
        }
      }
    });

    return introduce;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const res = await getDistrictDetail(id);
      if (!res) return;

      try {
        res.images = typeof res.images === "string" ? JSON.parse(res.images) : res.images || [];
      } catch (error) {
        console.error("Lỗi parse JSON images:", error);
        res.images = [];
      }

      try {
        res.sections = typeof res.sections === "string" ? JSON.parse(res.sections) : res.sections || {};
        const sectionKeyMapping = {
          "Giới thiệu": "introduce",
          "Bản đồ vệ tinh": "satelliteMap",
          "Bản đồ giao thông": "trafficMap",
          "Bản đồ quy hoạch": "planningMap",
          "Bản đồ hành chính": "administrativeMap",
        };

        res.sections = Object.keys(res.sections).reduce((acc, key) => {
          const newKey = sectionKeyMapping[key] || key;
          acc[newKey] = res.sections[key].trim();
          return acc;
        }, {});

        if (res.sections.introduce) {
          res.introduce = extractIntroduceData(res.sections.introduce);
        }
      } catch (error) {
        console.error("Lỗi parse JSON sections:", error);
        res.sections = {};
      }

      // Kiểm tra xem HOOK_ID có phải đang ở dạng Json không
      if (typeof res.HOOK_ID === "string") {
        try {
          res.HOOK_ID= JSON.parse(res.HOOK_ID);
        } catch (error) {
          console.error("Lỗi parse JSON:", error);

          // Nếu lỗi, gán giá trị là object rỗng
          res.HOOK_ID = {};
        }
      }

      setDuLieu(res);
    };

    fetchData();
  }, [id]);

  // Khởi tạo mapTypes để lặp và đổ ra giao diện 
  const mapTypes = [
    { id: "ban-do-hanh-chinh", key: "administrativeMap", title: "Bản đồ hành chính" },
    { id: "ban-do-giao-thong", key: "trafficMap", title: "Bản đồ giao thông" },
    { id: "ban-do-ve-tinh", key: "satelliteMap", title: "Bản đồ vệ tinh" },
    // { id: "ban-do-quy-hoach", key: "planningMap", title: "Bản đồ quy hoạch" },
  ];

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
      {dulieu && (
        <div className="administrative-detail">
          <div className="administrative-detail__wrap">
            <button className="administrative-detail__back-button" onClick={() => navigate(`/administrative-maps/?provinceId=${dulieu.HOOK_ID.ProvinceID}`)}>
              ← Danh sách bản đồ hành chính 
            </button>
            <div className="administrative-detail__head-title">
              <h3 className="administrative-detail__title">{dulieu.title}</h3>
              <p className="administrative-detail__time">{convertToVietnamTime(dulieu.updated_at)}</p>
            </div>

            {/* NỘI DUNG */}
            <p className="administrative-detail__description">{dulieu.description}</p>

            <ol className="administrative-detail__sections">
              <li id="gioi-thieu" className="administrative-detail__sections-item">Giới thiệu</li>
              <p>{dulieu.introduce?.intro}</p>
              {dulieu.introduce &&
                Object.entries(dulieu.introduce).map(([key, value], index) => {
                  if (typeof value === "string") return null;
                  return (
                    <div key={index}>
                      <h3>{value.title}</h3>
                      <p>{value.details}</p>
                    </div>
                  );
                })}

              {mapTypes.map((item, index) => {
                const data = dulieu.sections?.[item.key]?.split("\n") || [];
                return (
                  <div key={item.id}>
                    <li id={item.id} className="administrative-detail__sections-item">{item.title}</li>
                    <p>{data.slice(1).join("\n")}</p>
                    <img src={dulieu.images?.[index]} alt={item.title} />
                    <span>{data[0]}</span>
                  </div>
                );
              })}

              <div>
                <li id="ban-do-quy-hoach" className="administrative-detail__sections-item">Bản đồ quy hoạch</li>
                {(() => {
                  const data = dulieu.sections?.planningMap?.split("\n") || [];
                  return (
                    <>
                      <p>{data.slice(0, -1).join("\n")}</p>
                      <img src={dulieu.images?.[3]} alt="Bản đồ quy hoạch" />
                      <span>{data.at(-1)}</span>
                    </>
                  );
                })()}
              </div>
            </ol>
          </div>
        </div>
      )}
    </Container>
  );
};

export default DetailAdministrativeMap;
