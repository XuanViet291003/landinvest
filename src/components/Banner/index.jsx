import { Carousel } from 'react-bootstrap';
import { arrayBannerImage } from '../../assets/banner/image';
import { Col, Grid, Row } from 'antd';
const { useBreakpoint } = Grid;
function Banner() {
    const screens = useBreakpoint();
    return (
        <Carousel style={{ marginTop: '15px' }} controls={false} interval={5000}>
            {screens.sm
                ? arrayBannerImage[0].map((image, index) => (
                      <Carousel.Item key={index}>
                          <Row gutter={[10, 0]}>
                              <Col md={12} sm={12} xs={24}>
                                  <img className="image-banner mb-3" src={image.first} alt="" />
                              </Col>
                              <Col md={12} sm={12} xs={24}>
                                  <img className="image-banner" src={image.second} alt="" />
                              </Col>
                          </Row>
                      </Carousel.Item>
                  ))
                : arrayBannerImage[1].map((image, index) => (
                      <Carousel.Item key={index}>
                          <Row gutter={[10, 0]}>
                              <Col span={24}>
                                  <img className="image-banner mb-3" src={image} alt="" />
                              </Col>
                          </Row>
                      </Carousel.Item>
                  ))}
        </Carousel>
    );
}

export default Banner;
