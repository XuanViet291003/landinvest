import React from 'react';
import { Container } from 'react-bootstrap';
import './About.scss';
import { useNavigate } from 'react-router-dom';
export default function AboutUs() {
    const navigate = useNavigate();
    const imagesSectionOne = [
        'https://quyhoach.xyz/image_public/comment/data-info-congty/1.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/2.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/3.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/4.jpg',
    ];
    const imagesTeamSection = [
        'https://quyhoach.xyz/image_public/comment/data-info-congty/4.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/5.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/6.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/7.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/8.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/9.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/10.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/11.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/12.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/13.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/14.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/15.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/16.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/17.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/18.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/19.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/20.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/21.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/22.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/23.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/24.jpg',
        'https://quyhoach.xyz/image_public/comment/data-info-congty/25.jpg',
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
