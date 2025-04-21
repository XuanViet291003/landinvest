// // ProjectCarousel.jsx
// import React, { useRef } from "react";
// import OwlCarousel from "react-owl-carousel3";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLink } from "@fortawesome/free-solid-svg-icons";
// import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

// import "owl.carousel/dist/assets/owl.carousel.css";
// import "owl.carousel/dist/assets/owl.theme.default.css";


// const ProjectCarousel = ({items}) => {
//     const carouselRef = useRef();

//     return (
//         <div className="container-fluid my-4">
//             <div className="text-center mb-3">
//                 <button className="btn btn-outline-dark mx-2" onClick={() => carouselRef.current.prev()} style={{ borderRadius: '50%', color: "#FFFFFF", opacity: 1 }}>
//                     <KeyboardArrowLeftIcon />
//                 </button>
//                 <button className="btn btn-outline-dark mx-2" onClick={() => carouselRef.current.next()} style={{ borderRadius: '50%', color: "#FFFFFF", opacity: 1,  }}>
//                     <KeyboardArrowRightIcon />
//                 </button>
//             </div>

//             <div className="w-full px-4">
//                 <OwlCarousel
//                     className="owl-theme"
//                     loop
//                     items={3}
//                     margin={-135}
//                     ref={carouselRef}
//                     autoplay
//                     autoplayHoverPause
//                     dots={false}
//                     stagePadding={60}
//                     center={true}
//                     responsive={{
//                         0: { items: 1, stagePadding: 30 },
//                         480: { items: 2, stagePadding: 40 },
//                         768: { items: 3, stagePadding: 50 }
//                     }}
//                 >
//                     {items.map((item, idx) => (
//                         <div className="item" key={idx}>
//                             <img src={item.img} alt={item.title} style={{height: item.heightStyle}}/>
//                             <div className="down-content">
//                                 <h4>{item.title}</h4>
//                                 <p>{item.desc}</p>
//                                 <a href={item.link} target="_blank" rel="noopener noreferrer">
//                                     <FontAwesomeIcon icon={faLink} />
//                                 </a>
//                             </div>
//                         </div>
//                     ))}
//                 </OwlCarousel>
//             </div>

//         </div>
//     );
// };

// export default ProjectCarousel;


// ProjectCarousel.jsx
import React, { useRef } from "react";
import Slider from "react-slick";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProjectCarousel = ({ items }) => {
    const sliderRef = useRef();

    const settings = {
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        centerMode: true,
        centerPadding: "60px",
        arrows: false,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                    centerPadding: "40px"
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    centerPadding: "30px"
                }
            }
        ]
    };

    return (
        <div className="container-fluid my-4">
            <div className="text-center mb-3">
                <button
                    className="btn btn-outline-dark mx-2"
                    onClick={() => sliderRef.current.slickPrev()}
                    style={{ borderRadius: '50%', color: "#FFFFFF", opacity: 1 }}
                >
                    <KeyboardArrowLeftIcon />
                </button>
                <button
                    className="btn btn-outline-dark mx-2"
                    onClick={() => sliderRef.current.slickNext()}
                    style={{ borderRadius: '50%', color: "#FFFFFF", opacity: 1 }}
                >
                    <KeyboardArrowRightIcon />
                </button>
            </div>

            <div className="w-full px-4">
                <Slider ref={sliderRef} {...settings}>
                    {items.map((item, idx) => (
                        <div className="px-2" key={idx}>
                            <img src={item.img} alt={item.title} style={{ height: item.heightStyle, width: "100%" }} />
                            <div className="down-content">
                                <h4>{item.title}</h4>
                                <p>{item.desc}</p>
                                <a href={item.link} target="_blank" rel="noopener noreferrer">
                                    <FontAwesomeIcon icon={faLink} />
                                </a>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default ProjectCarousel;
