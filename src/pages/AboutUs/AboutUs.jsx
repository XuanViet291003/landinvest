import React from 'react';
import { Container } from 'react-bootstrap';
import './About.scss';
import { useNavigate } from 'react-router-dom';

import aboutUsImg1 from '../../assets/data-info-congty/1.jpg';
import aboutUsImg2 from '../../assets/data-info-congty/2.jpg';
import aboutUsImg3 from '../../assets/data-info-congty/3.jpg';
import aboutUsImg4 from '../../assets/data-info-congty/4.jpg';
import aboutUsImg5 from '../../assets/data-info-congty/5.jpg';
import aboutUsImg6 from '../../assets/data-info-congty/6.jpg';
import aboutUsImg7 from '../../assets/data-info-congty/7.jpg';
import aboutUsImg8 from '../../assets/data-info-congty/8.jpg';
import aboutUsImg9 from '../../assets/data-info-congty/9.jpg';
import aboutUsImg10 from '../../assets/data-info-congty/10.jpg';
import aboutUsImg11 from '../../assets/data-info-congty/11.jpg';
import aboutUsImg12 from '../../assets/data-info-congty/12.jpg';
import aboutUsImg13 from '../../assets/data-info-congty/13.jpg';
import aboutUsImg14 from '../../assets/data-info-congty/14.jpg';
import aboutUsImg15 from '../../assets/data-info-congty/15.jpg';
import aboutUsImg16 from '../../assets/data-info-congty/16.jpg';
import aboutUsImg17 from '../../assets/data-info-congty/17.jpg';
import aboutUsImg18 from '../../assets/data-info-congty/18.jpg';
import aboutUsImg19 from '../../assets/data-info-congty/19.jpg';
import aboutUsImg20 from '../../assets/data-info-congty/20.jpg';
import aboutUsImg21 from '../../assets/data-info-congty/21.jpg';
import aboutUsImg22 from '../../assets/data-info-congty/22.jpg';
import aboutUsImg23 from '../../assets/data-info-congty/23.jpg';
import aboutUsImg24 from '../../assets/data-info-congty/24.jpg';
import aboutUsImg25 from '../../assets/data-info-congty/25.jpg';
import aboutUsImg26 from '../../assets/data-info-congty/26.jpg';
import aboutUsImg27 from '../../assets/data-info-congty/27.jpg';
import aboutUsImg28 from '../../assets/data-info-congty/28.jpg';
import aboutUsImg29 from '../../assets/data-info-congty/29.jpg';
import aboutUsImg30 from '../../assets/data-info-congty/30.jpg';
import aboutUsImg31 from '../../assets/data-info-congty/31.jpg';
import aboutUsImg32 from '../../assets/data-info-congty/32.jpg';
import aboutUsImg33 from '../../assets/data-info-congty/33.jpg';
import aboutUsImg34 from '../../assets/data-info-congty/34.jpg';
import aboutUsImg35 from '../../assets/data-info-congty/35.jpg';
import aboutUsImg36 from '../../assets/data-info-congty/36.jpg';
import aboutUsImg37 from '../../assets/data-info-congty/37.jpg';

export default function AboutUs() {
    const navigate = useNavigate();
    
    const imagesSectionOne = [aboutUsImg1, aboutUsImg2, aboutUsImg3, aboutUsImg4];
    
    const imagesTeamSection = [
        aboutUsImg5, aboutUsImg6, aboutUsImg7, aboutUsImg8, aboutUsImg9,
        aboutUsImg10, aboutUsImg11, aboutUsImg12, aboutUsImg13, aboutUsImg14,
        aboutUsImg15, aboutUsImg16, aboutUsImg17, aboutUsImg18, aboutUsImg19,
        aboutUsImg20, aboutUsImg21, aboutUsImg22, aboutUsImg23, aboutUsImg24,
        aboutUsImg25, aboutUsImg26, aboutUsImg27, aboutUsImg28, aboutUsImg29,
        aboutUsImg30, aboutUsImg31, aboutUsImg32, aboutUsImg33, aboutUsImg34,
        aboutUsImg35, aboutUsImg36, aboutUsImg37
    ];
    const handleClickStart = () => {
        navigate('/bidding?page=1&limit=10');
    };
    return (
        <Container className="aboutus-container" style={{ marginBottom: '500px' }}>
            <section className="section_one">
                <div className="section_one_text">
                    <div className="section_one_text_content">
                        <h1>
                            Chúng tôi là{' '}
                            <span style={{ color: '#B74C00' }}>
                                Land<span style={{ color: '#3DB700' }}>Invest</span>
                            </span>
                        </h1>
                        <p style={{ marginTop: '25px' }}>
                            <h3 style={{ color: '#B74C00', fontWeight: 700, display: 'inline' }}>
                                Land<span style={{ color: '#3DB700' }}>Invest</span>
                            </h3>{' '}
                            là sản phẩm Big data AI - Sản phẩm sẽ hỏi những nhu cầu mua bất động sản của bạn, chúng tôi
                            sẽ thu thập và tìm kiếm trong dữ liệu bigdata để đưa cho bạn những sản phẩm đầu tư phù hợp,
                            Chúng tôi sẽ tổng hợp những dự án đầu tư công , sẽ báo cho bạn biết những nơi nào sắp có đột
                            biến hạ tầng, chúng tôi cũng tìm kiếm những dự án sắp làm, những nơi nào sắp đột biến hạ
                            tầng cơ học để đưa các bạn dự đoán chính xác, Giúp tối ưu lợi nhuận khoản đầu tư, cũng như
                            tổng hợp cho các bạn những dữ liệu toàn cảnh của thị trường bất động sản. Ví dụ như những
                            nơi nào đang được thu mua, gom mua nhiều nhất trên thị trường, những nơi nào đang có dấu
                            hiệu giao dịch lớn…
                        </p>
                    </div>
                </div>
                <div className="section_one_image">
                    {imagesSectionOne.map((item, index) => (
                        <img className="images-section" src={item} key={index} alt="" />
                    ))}
                </div>
            </section>
            <section className="section_two">
                <h1 style={{ fontWeight: 700 }}>Tính xác thực của thông tin về bất động sản hiện nay!</h1>
                <p>
                    Bất động sản là 1 lĩnh vực rất nhiều tin “rác” … đúng ! Bạn k nghe nhầm đâu … 99% là rác rưởi, chủ
                    yếu của sale và chủ đầu tư quảng cáo bán hàng . Và bạn hãy tin tôi , chúng ta sẽ xử lý rác, nhập
                    khẩu rác … chế biến rác. Những thứ rác của không gian mạng … trở thành những tin tức “được sàng lọc”
                    bằng dữ liệu big data từ nguồn tin của chính phủ…hoặc bằng các gói hoặc quyết định đầu tư công.
                    Những thứ bạn đc nghe hàng ngày, con đường này sắp làm, chủ đầu tư này sắp xây ….. sẽ đc lọc ra, đc
                    AI dựa vào đống rác bigdata để cho bạn kết luận chính xác….. thật tuyệt vời ….. hãy tin tôi nhé!
                </p>
                <img src="https://res.cloudinary.com/dpplfiyki/image/upload/v1737782955/Group_2767_gvewqi.png" alt="" />
            </section>
            <section className="section_three">
                <div>
                    <img
                        src="https://res.cloudinary.com/dpplfiyki/image/upload/v1737783374/Group_2768_rztdvi.png"
                        alt=""
                    />
                </div>
                <div className="section_three_content">
                    <h3 style={{ fontWeight: 700, textAlign: 'center' }}>
                        Sứ mệnh của{' '}
                        <span style={{ color: '#B74C00' }}>
                            Land<span style={{ color: '#3DB700' }}>Invest</span>
                        </span>
                    </h3>
                    <p>
                        Liệt kê toàn bộ quy hoạch các tỉnh - các huyện ở trên đất nước việt nam, giúp bạn check quy
                        hoạch nhanh nhất, tìm kiếm dữ liệu địa chính để biết chính xác lô đất của ai, hình thù nó thế
                        nào, giúp bạn đo đạc làm sổ đỏ, lên thổ cư nhanh nhất.
                    </p>
                    <p style={{ color: '#3DB700', transform: 'translateX(-5%)' }}>
                        ⇒ Chúng tôi là đơn vị có dữ liệu địa chính cũng như dữ liệu quy hoạch lớn nhất việt nam
                    </p>
                    <p>
                        Bạn muốn đi đấu giá, bạn muốn cập nhật thông tin đấu giá mới nhất của nhà nước, chúng tôi sẽ
                        phân mục rõ ràng những chỗ chuẩn bị đấu giá, thông tin công khai và được cập nhật hàng phút,
                        ngoài ra còn gắn vị trí, đưa thông tin hình ảnh cho người dùng tìm kiếm nhanh nhất, giúp người
                        dùng tìm đc các lô đấu giá rẻ, số lượng người đấu ít, giúp bạn mua rẻ hơn mua của người dân.
                    </p>
                </div>
            </section>
            <section className="section_four">
                <h1 style={{ textAlign: 'center', fontWeight: 700 }}>
                    Dịch Vụ Tìm Thầu Chất Lượng - Cập Nhật Hàng Ngày
                </h1>
                <p>
                    Nếu bạn là một nhà thầu cần tìm các gói thầu cho nhân viên của bạn, hãy đến với chúng tôi, chúng tôi
                    sẽ lọc các thông tin thầu mới nhất, những thông tin thầu chất lượng, dễ làm, giá cao cho các bạn,
                    thông báo cho các bạn hàng ngày, sử dụng AI để suggest cho các bạn nhiều thông tin đấu thầu phù hợp
                    với bạn.
                </p>
                <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center' }}>
                    <button onClick={() => handleClickStart()}>Bắt đầu</button>
                </div>
            </section>
            <section className="section_five">
                <h1 style={{ textAlign: 'center', fontWeight: 700 }}>Đội ngũ của chúng tôi</h1>
                <div className="team-images">
                    {imagesTeamSection.map((item, index) => (
                        <img src={item} key={index} alt={item} className="image-about" />
                    ))}
                </div>
            </section>
        </Container>
    );
}
