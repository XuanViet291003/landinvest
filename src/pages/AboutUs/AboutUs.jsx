import React from 'react';
import { Container } from 'react-bootstrap';
import './About.scss';
import { useNavigate } from 'react-router-dom';
export default function AboutUs() {
    const navigate = useNavigate();
    const imagesSectionOne = [
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737782390/%C3%B4_3_c6utdc.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737782390/%C3%B4_1_gzqhwb.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737782389/%C3%B4_2_k2uwwl.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737782389/%C3%B4_4_gfupjd.png',
    ];
    const imagesTeamSection = [
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784292/462560327_597593772678951_8476039846705955411_n_hz6tq9.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784291/462543434_525518443867369_3426750171035081637_n_h83vqj.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784289/462582848_860125936093053_6948682989442901709_n_n8w5wv.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784291/473106937_1140454614092059_6726556338454692327_n_sfohxn.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784290/472292886_577727778500546_4933551119050640698_n_trtskn.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784289/472239324_568355882684092_7720430744313465190_n_io2iqo.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784288/462579633_1746581165883653_3058646124622926554_n_lbzpnf.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784288/462579055_1976878459464139_690626193817936838_n_igaxxe.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784283/462577943_943753241095430_6331102426649600161_n_esfr3p.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784277/462577672_884389663770779_5737372196800546663_n_wx4d2l.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784277/462573490_1565796577456022_5436035398246276009_n_mmhuny.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784277/462577600_560448903648120_5285626304935311053_n_s01kkj.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784276/462561221_1164594658337672_4670947085700116669_n_dudjiv.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784276/462571462_471038182375974_9053863983361285420_n_qa91rf.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784277/462571482_1077465610795246_60312568039578858_n_xr6wae.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784276/462565713_1333583781325966_7412630213846452438_n_zeorsl.png',
        'https://res.cloudinary.com/dpplfiyki/image/upload/v1737784276/462571373_642060521478697_3135475218826515828_n_antoqf.png',
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
                <div className='team-images'>
                    {imagesTeamSection.map((item, index) => (
                        <img src={item} key={index} alt={item}></img>
                    ))}
                </div>
            </section>
        </Container>
    );
}
