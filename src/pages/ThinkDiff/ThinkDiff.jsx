import React, { useState, useEffect } from 'react';
import ProjectCarousel from './component/ProjectCarousel'

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { fa } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// Mạng xã hội
import {
  faFacebook,
  faFacebookF,
  faTwitter,
  faTwitterSquare,
  faLinkedin,
  faLinkedinIn,
  faInstagram,
  faYoutube,
  faTiktok,
  faGithub,
  faReddit,
  faGoogle,
  faGooglePlusG,
  faTelegram,
  faWhatsapp,
  faPinterest,
  faSnapchatGhost,
  faAndroid,
  faApple,

} from '@fortawesome/free-brands-svg-icons'
import { faLink, faExternalLinkAlt, faShareFromSquare, faArrowLeft } from '@fortawesome/free-solid-svg-icons'


import "./css/animate.css";
import "./css/flex-slider.css";
// import "./css/fontawesome.css";
import "./css/owl.css";
import "./css/templatemo-tale-seo-agency.css";

import logo_think_diff_us from "./images/logo_think_diff_us.png";
import services_01 from "./images/services-01.jpg";
import services_02 from "./images/services-02.jpg";
import services_03 from "./images/services-03.jpg";
import services_04 from "./images/services-04.jpg";
import _246x0w1 from "./images/246x0w (1).jpg";
import _246x0w2 from "./images/246x0w (2).jpg";
import _246x0w0 from "./images/246x0w.jpg";
import _434x0w from "./images/434x0w.jpg";
import _434x0w1 from "./images/434x0w1.jpg";

import img01 from './images/img01.jpg'
import img02 from './images/img02.jpg'
import img03 from './images/img03.jpg'
import img04 from './images/img04.jpg'
import img05 from './images/img05.jpg'
import img06 from './images/img06.jpg'
import img07 from './images/img07.jpg'
import img08 from './images/img08.jpg'
import img09 from './images/img09.jpg'
import img010 from './images/img010.jpg'
import img011 from './images/img011.jpg'
import img012 from './images/img012.jpg'
import img013 from './images/img013.jpg'
import img014 from './images/img014.jpg'
import img015 from './images/img015.jpg'
import img029 from './images/img029.jpg'
import img030 from './images/img030.jpg'
import img031 from './images/img031.jpg'
import img032 from './images/img032.jpg'
import img033 from './images/img033.jpg'
import img034 from './images/img034.jpg'
import img035 from './images/img035.jpg'
import img036 from './images/img036.jpg'
import img037 from './images/img037.jpg'
import img038 from './images/img038.jpg'
import img039 from './images/img039.jpg'
import img040 from './images/img040.jpg'
import img041 from './images/img041.jpg'
import img042 from './images/img042.jpg'
import img043 from './images/img043.jpg'
import img044 from './images/img044.jpg'
import img045 from './images/img045.jpg'
import img046 from './images/img046.jpg'
import img047 from './images/img047.jpg'
import img048 from './images/img048.jpg'
import img049 from './images/img049.jpg'
import img050 from './images/img050.jpg'
import img051 from './images/img051.jpg'
import img052 from './images/img052.jpg'
import img053 from './images/img053.jpg'

import img016 from './images/img016.jpg'
import img017 from './images/img017.jpg'
import img018 from './images/img018.jpg'
import img019 from './images/img019.jpg'
import img020 from './images/img020.jpg'
import img021 from './images/img021.jpg'
import img022 from './images/img022.jpg'
import img023 from './images/img023.jpg'
import img024 from './images/img024.jpg'
import img025 from './images/img025.jpg'
import img026 from './images/img026.jpg'
import img027 from './images/img027.jpg'
import img028 from './images/img028.jpg'
import img054 from './images/img054.jpg'
import img055 from './images/img055.jpg'
import img056 from './images/img056.jpg'
import img057 from './images/img057.jpg'
import img058 from './images/img058.jpg'

import left_infos from './images/left-infos.jpg'
import left_infos1 from './images/left-infos1.jpg'
import left_infos2 from './images/left-infos2.jpg'
import left_infos3 from './images/left-infos3.jpg'
import left_infos4 from './images/left-infos4.jpg'

const ThinkDiff = () => {

  // useEffect(() => {
  //   const handleLoad = () => {
  //     const preloader = document.getElementById('js-preloader');
  //     if (preloader) {
  //       preloader.style.display = 'none';
  //     }
  //   };

  //   // Chờ DOM sẵn sàng (có thể dùng window.onload hoặc tương đương)
  //   window.addEventListener('load', handleLoad);

  //   return () => {
  //     window.removeEventListener('load', handleLoad);
  //   };
  // }, []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1000); // tắt preloader sau 1 giây
    return () => clearTimeout(timeout);
  }, []);

  const itemsProjects = [
    { img: _246x0w1, title: "Prank air horn, fart, clipper", desc: "Clippers prank & funny sounds", link: "https://apps.apple.com/app/id1623746709" },
    { img: _246x0w2, title: "Manga Reader : Top Manga Here ", desc: "Best App for Manga & Novel Read", link: "https://apps.apple.com/app/id1635298030" },
    { img: _246x0w0, title: "Face Dance: Photo Animator App", desc: "Lip Sync, Funny Face Animation", link: "https://apps.apple.com/app/id1590841930" },
    { img: _434x0w, title: "Celebrity Voice Changer Parody", desc: "100+ Voices Live & AI Singing", link: "https://apps.apple.com/app/id1111710488", heightStyle: '420.56px' },
    { img: _434x0w1, title: "Dawn AI - Avatar generator", desc: "Transform your selfies with AI", link: "https://apps.apple.com/app/id1643890882", heightStyle: '420.56px' }
  ];
  const itemWorkplace = [
    { img: img01, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img02, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img03, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img04, title: "Friendly Membership", link: "#" },
    { img: img05, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img06, title: "Friendly Membership", link: "#" },
    { img: img07, title: "Friendly Membership", link: "#" },
    { img: img08, title: "Workplace", link: "#" },
    { img: img09, title: "Friendly Memship", link: "#" },
    { img: img010, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img011, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img012, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img013, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img014, title: "Workplace", link: "#" },
    { img: img015, title: "Workplace", link: "#" },
    { img: img029, title: "Workplace", link: "#" },
    { img: img030, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img031, title: "Workplace", link: "#" },
    { img: img032, title: "Workplace", link: "#" },
    { img: img033, title: "Workplace", link: "#" },
    { img: img034, title: "workplace", link: "#", heightStyle: '420.56px' },
    { img: img035, title: "Workplace", link: "#" },
    { img: img036, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img037, title: "Workplace", link: "#" },
    { img: img038, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img039, title: "Workplace", link: "#" },
    { img: img040, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img041, title: "Workplace", link: "#" },
    { img: img042, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img043, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img044, title: "Workplace", link: "#" },
    { img: img045, title: "Workplace", link: "#" },
    { img: img046, title: "Workplace", link: "#" },
    { img: img047, title: "Workplace", link: "#" },
    { img: img048, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img049, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img050, title: "Workplace", link: "#", heightStyle: '420.56px' },
    { img: img051, title: "Workplace", link: "#" },
    { img: img052, title: "Workplace", link: "#" },
    { img: img053, title: "Workplace", link: "#" },
  ];
  const itemsExtracurricular = [
    { img: img016, title: "2022", link: "#", heightStyle: '220.56px' },
    { img: img017, title: "2022", link: "#", heightStyle: '220.56px' },
    { img: img018, title: "2022", link: "#", heightStyle: '220.56px' },
    { img: img019, title: "2022", link: "#", heightStyle: '220.56px' },
    { img: img020, title: "2017", link: "#", heightStyle: '220.56px' },
    { img: img021, title: "2017", link: "#", heightStyle: '220.56px' },
    { img: img022, title: "2017", link: "#", heightStyle: '220.56px' },
    { img: img023, title: "2017", link: "#", heightStyle: '220.56px' },
    { img: img024, title: "2017", link: "#", heightStyle: '220.56px' },
    { img: img025, title: "2017", link: "#", heightStyle: '220.56px' },
    { img: img026, title: "2017", link: "#", heightStyle: '220.56px' },
    { img: img027, title: "2017", link: "#", heightStyle: '220.56px' },
    { img: img028, title: "2017", link: "#", heightStyle: '220.56px' },
    { img: img054, title: "2021", link: "#", heightStyle: '220.56px' },
    { img: img055, title: "2021", link: "#", heightStyle: '220.56px' },
    { img: img056, title: "2021", link: "#", heightStyle: '220.56px' },
    { img: img057, title: "2021", link: "#", heightStyle: '220.56px' },
    { img: img058, title: "2021", link: "#", heightStyle: '220.56px' }
  ]

  return (
    <>
      {/* ***** Preloader Start *****  */}
      {
        loading &&
        <div id="js-preloader" className="js-preloader">
          <div className="preloader-inner">
            <span className="dot"></span>
            <div className="dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      }

      {/* ***** Preloader End ***** */}

      {/* ***** Pre-Header Area Start ***** */}
      <div className="pre-header">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-sm-9">
              <div className="left-info">
                <ul>
                  <li><a href="#"><i className="fab fa-phone"></i>0582.296.888</a></li>
                  <li><a href="#"><i className="fab fa-envelope"></i>hr@thinkdiff.us</a></li>
                  <li><a href="#"><i className="fab fa-map-marker"></i>Số 30 Đường Louis 7, Louis city, Hà Nội, Vietnam</a></li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-sm-3">
              <div className="social-icons">
                <ul>

                  <li><a href="#"><FontAwesomeIcon icon={faFacebook} /></a></li>
                  <li><a href="#"><FontAwesomeIcon icon={faTwitter} /></a></li>
                  <li><a href="#"><FontAwesomeIcon icon={faLinkedin} /></a></li>
                  <li><a href="#"><FontAwesomeIcon icon={faGooglePlusG} /></a></li>


                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ***** Pre-Header Area End ***** */}

      {/* ***** Header Area Start ***** */}
      <header className="header-area header-sticky">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <nav className="main-nav">
                {/* ***** Logo Start ***** */}
                <a href="./index.html" className="logo">
                  <h1 className="scroll-to-section"><img src={logo_think_diff_us} /></h1>
                </a>
                {/* ***** Logo End ***** */}
                {/* ***** Menu Start ***** */}
                <ul className="nav">
                  <li className="scroll-to-section"><a href="#top" className="active">Home</a></li>
                  <li className="scroll-to-section"><a href="#services">Services</a></li>
                  <li className="scroll-to-section"><a href="#projects">Workplace</a></li>
                  <li className="scroll-to-section"><a href="about.html">About Us</a></li>
                  <li className="scroll-to-section"><a href="#infos">Infos</a></li>
                  <li className="scroll-to-section"><a href="#contact">Contact</a></li>
                </ul>
                <a className='menu-trigger'>
                  <span>Menu</span>
                </a>
                {/* ***** Menu End ***** */}
              </nav>
            </div>
          </div>
        </div>
      </header>
      {/* ***** Header Area End ***** */}

      <div className="main-banner" id="top">
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="caption header-text">
                <h6>ThinkDiff AI - a Software Products Company</h6>
                <div className="line-dec"></div>

                <h4> Specializing in <em>artificial intelligence </em>
                  applications</h4>
                <h6> The Power Of Creativity</h6>
                <p>We develop a large number of small, fast products for short jobs, such as automatic facial makeup without
                  wasting time. , automatically compose interviews, automatically find cheap airline tickets, automatically
                  find saleoff orders, automatically find customers who need to rent a house, automatically find customers
                  to sell houses, automatically look up, automatically find and sell houses. customer inquiries. Our company
                  has 200 employees in 3 different locations, the headquarters in Louis city is the place where training and
                  human resource development is combined, the sales department is located at 69 Vạn Phuc. Congratulations
                  for your interest in our company and for taking the time to read this article.

                  Thank you.
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="services section" id="services">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-6">
              <div className="row">
                <div className="col-lg-12">
                  <div className="section-heading">
                    <h2>We Provide <em>Different Services</em> &amp;
                      <span>Features</span> For Your Agency
                      <em>The Power Of Creativity</em>
                    </h2>
                    <div className="line-dec"></div>

                  </div>
                </div>
                <div className="col-lg-6 col-sm-6">
                  <div className="service-item">
                    <div className="icon">
                      <img src={services_01} alt="discover SEO" className="templatemo-feature" />
                    </div>
                    <h4>Discover more about the latest world trends</h4>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6">
                  <div className="service-item">
                    <div className="icon">
                      <img src={services_02} alt="data analysis" className="templatemo-feature" />
                    </div>
                    <h4>Analyze large requirements completely by customer</h4>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6">
                  <div className="service-item">
                    <div className="icon">
                      <img src={services_03} alt="precise data" className="templatemo-feature" />
                    </div>
                    <h4>Precise Data Analysis &amp; Prediction</h4>
                  </div>
                </div>
                <div className="col-lg-6 col-sm-6">
                  <div className="service-item">
                    <div className="icon">
                      <img src={services_04} alt="SEO marketing" className="templatemo-feature" />
                    </div>
                    <h4>35000+ Client</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="projects section" id="projects">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-heading">
                <h2>Discover Our <em>projects</em> &amp; <span>products</span></h2>
                <div className="line-dec"></div>
                <p>The important thing is that the customer is the customer, the customer will follow the customer, but so
                  are the workers.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Thêm ProjectCarousel */}
        <ProjectCarousel items={itemsProjects} />

        {/* <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="owl-features owl-carousel">
                <div className="item">
                  <img src={_246x0w1} alt="" />
                  <div className="down-content">
                    <h4>Prank air horn, fart, clipper</h4>
                    <p>Clippers prank & funny sounds</p>
                    <a href="https://apps.apple.com/us/app/prank-air-horn-fart-clipper/id1623746709">
                      <FontAwesomeIcon icon={faLink} />
                    </a>
                  </div>
                </div>
                <div className="item">
                  <img src={_246x0w2} alt="" />
                  <div className="down-content">
                    <h4>Manga Reader : Top Manga Here </h4>
                    <p>Best App for Manga & Novel Read</p>
                    <a href="https://apps.apple.com/us/app/manga-reader-top-manga-here/id1635298030">
                      <FontAwesomeIcon icon={faLink} />
                    </a>
                  </div>
                </div>
                <div className="item">
                  <img src={_246x0w0} alt="" />
                  <div className="down-content">
                    <h4>Face Dance: Photo Animator App</h4>
                    <p>Lip Sync, Funny Face Animation</p>
                    <a href="https://apps.apple.com/us/app/mimic-ai-photo-face-animator/id1590841930">
                      <FontAwesomeIcon icon={faLink} />
                    </a>
                  </div>
                </div>
                <div className="item">
                  <img src={_434x0w} alt="" style={{ height: '420.56px' }} />
                  <div className="down-content">
                    <h4>Celebrity Voice Changer Parody</h4>
                    <p>100+ Voices Live & AI Singing</p>
                    <a href="https://apps.apple.com/us/app/celebrity-voice-changer-parody/id1111710488">
                      <FontAwesomeIcon icon={faLink} />
                    </a>
                  </div>
                </div>

                <div className="item">
                  <img src={_434x0w1} alt="" style={{ height: '420.56px' }} />
                  <div className="down-content">
                    <h4>Dawn AI - Avatar generator</h4>
                    <p>Transform your selfies with AI</p>
                    <a href="https://apps.apple.com/us/app/dawn-ai-avatar-generator/id1643890882">
                      <FontAwesomeIcon icon={faLink} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      <div className="projects section" id="projects">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-heading">
                <h2>Discover Our <em>Workplace</em> &amp; <span>Member</span></h2>
                <div className="line-dec"></div>
                <p>The important thing is that the customer is the customer, the customer will follow the customer, but so
                  are the workers.</p>
              </div>
            </div>
          </div>
        </div>
        <ProjectCarousel items={itemWorkplace} />
        {/* <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="owl-features owl-carousel">
                <div className="item">
                  <img src="assets/images/img01.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>
                <div className="item">
                  <img src="assets/images/img02.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>
                <div className="item">
                  <img src="assets/images/img03.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>
                <div className="item">
                  <img src="assets/images/img04.jpg" alt="" />
                  <div className="down-content">
                    <h4>Friendly Membership</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>
                <div className="item">
                  <img src="assets/images/img05.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>
                <div className="item">
                  <img src="assets/images/img06.jpg" alt="" />
                  <div className="down-content">
                    <h4>Friendly Membership</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>
                <div className="item">
                  <img src="assets/images/img07.jpg" alt="" />
                  <div className="down-content">
                    <h4>Friendly Membership</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>
                <div className="item">
                  <img src="assets/images/img08.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>
                <div className="item">
                  <img src="assets/images/img09.jpg" alt="" />
                  <div className="down-content">
                    <h4>Friendly Memship</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>
                <div className="item">
                  <img src="assets/images/img010.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img011.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img012.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img013.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img014.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img015.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img029.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img030.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>
                <div className="item">
                  <img src="assets/images/img031.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>
                <div className="item">
                  <img src="assets/images/img032.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img033.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img034.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img035.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img036.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img037.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img038.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img039.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img040.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img041.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img042.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img043.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img044.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img045.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img046.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img047.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img048.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img049.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img050.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img051.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img052.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img053.jpg" alt="" />
                  <div className="down-content">
                    <h4>Workplace</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      <div className="projects section" id="projects">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="section-heading">
                <h2>Discover Our <em>extracurricular activities</em> &amp; <span>development process</span> </h2>
                <div className="line-dec"></div>
                <p>The important thing is that the customer is the customer, the customer will follow the customer, but so
                  are the workers.</p>
              </div>
            </div>
          </div>
        </div>
        <ProjectCarousel items={itemsExtracurricular} />
        {/* <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="owl-features owl-carousel">
                <div className="item">
                  <img src="assets/images/img016.jpg" alt="" />
                  <div className="down-content">
                    <h4>2022</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img017.jpg" alt="" />
                  <div className="down-content">
                    <h4>2022</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img018.jpg" alt="" />
                  <div className="down-content">
                    <h4>2022</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img019.jpg" alt="" />
                  <div className="down-content">
                    <h4>2022</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>


                <div className="item">
                  <img src="assets/images/img020.jpg" alt="" />
                  <div className="down-content">
                    <h4>2017</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img021.jpg" alt="" />
                  <div className="down-content">
                    <h4>2017</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img022.jpg" alt="" />
                  <div className="down-content">
                    <h4>2017</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img023.jpg" alt="" />
                  <div className="down-content">
                    <h4>2017</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img024.jpg" alt="" />
                  <div className="down-content">
                    <h4>2017</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img025.jpg" alt="" />
                  <div className="down-content">
                    <h4>2017</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img026.jpg" alt="" />
                  <div className="down-content">
                    <h4>2017</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img027.jpg" alt="" />
                  <div className="down-content">
                    <h4>2017</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img028.jpg" alt="" />
                  <div className="down-content">
                    <h4>2017</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img054.jpg" alt="" />
                  <div className="down-content">
                    <h4>2021</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img055.jpg" alt="" />
                  <div className="down-content">
                    <h4>2021</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img056.jpg" alt="" />
                  <div className="down-content">
                    <h4>2021</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>

                </div>
                <div className="item">
                  <img src="assets/images/img057.jpg" alt="" />
                  <div className="down-content">
                    <h4>2021</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>

                <div className="item">
                  <img src="assets/images/img058.jpg" alt="" />
                  <div className="down-content">
                    <h4>2021</h4>
                    <a href="#"><FontAwesomeIcon icon="fa-solid fa-link" /></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      <div className="infos section" id="infos">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="main-content">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="left-image">
                      <img src={left_infos} alt="" />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="section-heading">
                      <h2>More <em>About Us</em> &amp; What <span>We Offer</span></h2>
                      <div className="line-dec"></div>
                      <p>We always bring quality, true value, customers always trust and choose us</p>
                    </div>
                    <div className="skills">
                      <div className="skill-slide marketing">
                        <div className="fill"></div>
                        <h6>IOS</h6>
                        <span>90%</span>
                      </div>
                      <div className="skill-slide digital">
                        <div className="fill"></div>
                        <h6>WEB</h6>
                        <span>80%</span>
                      </div>
                      <div className="skill-slide media">
                        <div className="fill"></div>
                        <h6>ANDROID</h6>
                        <span>90%</span>
                      </div>

                      <div className="skill-slide media">
                        <div className="fill"></div>
                        <h6>PYTHON</h6>
                        <span>90%</span>
                      </div>

                      <div className="skill-slide media">
                        <div className="fill"></div>
                        <h6>PYHP</h6>
                        <span>90%</span>
                      </div>
                    </div>
                    <p className="more-info">Pain itself is important, education is followed, but the doer falls at a time when
                      labor and pain, pain is important, education is followed, but so is the doer.
                    </p>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-us section" id="contact">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="contact-us-content">
                <div className="row">
                  <div className="col-lg-4">
                    <div id="map">

                      <img src={left_infos2} alt="" />
                      <img src={left_infos3} alt="" />
                      <img src={left_infos4} alt="" />
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <form id="contact-form" action="" method="post">
                      <div className="row">


                        <div className="col-lg-12">

                          <div className="section-heading">
                            <img src={left_infos1} alt="" />
                            <h2><em>Thinkdiff AI Company tuyển dụng intern design cho các ứng dụng và web ứng dụng trí tuệ
                              nhân tạo

                            </em> &amp; Ưu tiên ứng viên đã có kiến thức nền tảng
                              Chấp nhận sinh viên từ năm 2 trở lên
                              <span>CV gửi về hr@thinkdiff.us</span>
                            </h2>
                          </div>
                        </div>
                        <div className="more-info1">
                          <div className="row">
                            <ul>
                              <li>
                                <h4>1.design</h4>
                              </li>
                              <li>
                                <h4>2.python AI trí tuệ nhân tạo</h4>
                              </li>
                              <li>
                                <h4>3.android developer</h4>
                              </li>
                              <li>
                                <h4>4.ios developer</h4>
                              </li>
                              <li>
                                <h4> 5.fontend developer</h4>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </form>
                    <br />
                    <br />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="contact-us section" id="contact">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="contact-us-content">
                <div className="row">
                  <div className="col-lg-4">
                    <div id="map">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14900.866002411432!2d105.7578536!3d20.9839569!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3134535faf4a3b4b%3A0x583f82c08ae6f1b2!2zQ8O0bmcgdHkgdHLDrSB0deG7hyBuaMOibiB04bqhbyBUaGlua0RpZmY!5e0!3m2!1svi!2s!4v1678721887795!5m2!1svi!2s"
                        width="350" height="650" loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        frameBorder="0" style={{ border: 0, borderRadius: "23px", width: "100%", height: "670px" }}
                        allowFullScreen=""></iframe>

                    </div>
                  </div>
                  <div className="col-lg-8">
                    <form id="contact-form" action="" method="post">
                      <div className="row">
                        <div className="col-lg-12">
                          <div className="section-heading">
                            <h2><em>Contact Us</em> &amp; Get In <span>Touch</span></h2>
                          </div>
                        </div>
                        <div className="col-lg-6">
                          <fieldset>
                            <input type="name" name="name" id="name" placeholder="Your Name..." autoComplete="on" required />
                          </fieldset>
                        </div>
                        <div className="col-lg-6">
                          <fieldset>
                            <input type="surname" name="surname" id="surname" placeholder="Your Surname..."
                              autoComplete="on" required />
                          </fieldset>
                        </div>
                        <div className="col-lg-6">
                          <fieldset>
                            <input type="text" name="email" id="email" pattern="[^ @]*@[^ @]*" placeholder="Your E-mail..."
                              required="" />
                          </fieldset>
                        </div>
                        <div className="col-lg-6">
                          <fieldset>
                            <input type="subject" name="subject" id="subject" placeholder="Subject..." autoComplete="on" />
                          </fieldset>
                        </div>
                        <div className="col-lg-12">
                          <fieldset>
                            <textarea name="message" id="message" placeholder="Your Message"></textarea>
                          </fieldset>
                        </div>
                        <div className="col-lg-12">
                          <fieldset>
                            <button type="submit" id="form-submit" className="orange-button">Send Message Now</button>
                          </fieldset>
                        </div>
                      </div>
                    </form>
                    <br />

                    <div className="more-info">
                      <div className="row">

                        <h4><a href="#">Why thinkdiff Continuously recruits and maintains a staff of up to 200 people: If
                          anyone has ever done machine learning, you must know that machine learning takes a lot of
                          manpower to weigh, train machine learning, analyze data, A typical machine learning application
                          needs at least 10-20 people, our company is working on 20 machine learning products at the same
                          time. Because of the large number of people, our company is recruiting a large number of
                          developers, business analysts, testers, python developers, we are thriving and proud to be the
                          leading company in Vietnam in machine learning products, Come to thinkdiff AI company to
                          experience a creative working environment, free spirit to create global products, we have the
                          goal of creating the best products that attract 100 million users worldwide world,
                          Congratulations for reading all the information about our company</a></h4>

                      </div>
                    </div>

                    <br />

                    <div className="more-info">
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="info-item">
                            <i className="fa fa-phone"></i>
                            <h4><a href="#">0582.296.888</a></h4>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="info-item">
                            <i className="fa fa-envelope"></i>
                            <h4><a href="#"> hr@thinkdiff.us</a></h4>

                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="info-item">
                            <i className="fa fa-map-marker"></i>
                            <h4><a href="#"> Số 30 Đường Louis 7 Khu đô thị louis city đại mỗ, phường đại mỗ, Quận Nam Từ
                              Liêm, Thành phố Hà Nội, 10000 Việt Nam
                            </a></h4>
                          </div>
                        </div>


                      </div>
                    </div>

                    <br />

                    <div className="more-info">
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="info-item">
                            <FontAwesomeIcon icon={faAndroid} style={{ width: '36px', height: '32px', marginBottom: '10px' }} />
                            <h4><a style={{ fontSize: '16.5px' }}
                              href="https://cdn.fbsbx.com/v/t59.2708-21/337013142_1627741731004268_2904682436095363799_n.apk/interview-Question.apk?_nc_cat=101&ccb=1-7&_nc_sid=0cab14&_nc_ohc=uJ5ogA7EogYAX-GL6K8&_nc_ht=cdn.fbsbx.com&oh=03_AdQu4VuN2o7Adyc-c5TJyxMm3Adl1S4fFV47CJGOm0ZGfg&oe=645A50EE&dl=1">interview
                              question</a></h4>
                          </div>
                        </div>
                        <div className="col-lg-4">
                          <div className="info-item">
                            <FontAwesomeIcon icon={faApple} style={{ width: '36px', height: '32px', marginBottom: '10px' }} />
                            <h4><a style={{ fontSize: '16.5px' }}
                              href="https://apps.apple.com/us/app/devsenior-thinkdiff-interview/id6445922046">interview
                              question</a></h4>

                          </div>
                        </div>

                        <div className="col-lg-4">
                          <div className="info-item">
                            <FontAwesomeIcon icon={faArrowLeft} style={{ width: '36px', height: '32px', marginBottom: '10px' }} />
                            <h4><a style={{ fontSize: '16.5px' }}
                              href="#">interview question</a></h4>

                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer>
            <div className="container">
              <div className="col-lg-12">
                <p style={{ fontSize: '15.5px', fontFamily: "Source Sans Pro" }}>Copyright © 2023 <a href="#"> ThinkDiff</a>. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>


    </>
  )
}

export default ThinkDiff;
