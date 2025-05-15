import React, { useState, useEffect } from 'react';
import moment from 'moment';
import './CountDown.scss';

const CountDown = ({ timeTillDate, timeFormat }) => {
    const [timeLeft, setTimeLeft] = useState({
        days: undefined,
        hours: undefined,
        minutes: undefined,
        seconds: undefined,
    });

    useEffect(() => {
        const interval = setInterval(() => {
            const then = moment(timeTillDate, timeFormat);
            const now = moment();
            const countdown = moment.duration(then.diff(now));

            const days = Math.floor(countdown.asDays());
            const hours = countdown.hours();
            const minutes = countdown.minutes();
            const seconds = countdown.seconds();

            setTimeLeft({ days, hours, minutes, seconds });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeTillDate, timeFormat]);

    const { days, hours, minutes, seconds } = timeLeft;

    if (seconds === undefined) {
        return null;
    }

    const daysRadius = mapNumber(days, 30, 0, 0, 360);
    const hoursRadius = mapNumber(hours, 24, 0, 0, 360);
    const minutesRadius = mapNumber(minutes, 60, 0, 0, 360);
    const secondsRadius = mapNumber(seconds, 60, 0, 0, 360);

    return (
        <div>
            <h1 style={{ color: '#FF6347' }}>Thời gian còn lại:</h1>
            <div className="countdown-wrapper">
                {days !== undefined && (
                    <div className="countdown-item">
                        <SVGCircle radius={daysRadius} />
                        {days}
                        <span>days</span>
                    </div>
                )}
                {hours !== undefined && (
                    <div className="countdown-item">
                        <SVGCircle radius={hoursRadius} />
                        {hours}
                        <span>hours</span>
                    </div>
                )}
                {minutes !== undefined && (
                    <div className="countdown-item">
                        <SVGCircle radius={minutesRadius} />
                        {minutes}
                        <span>minutes</span>
                    </div>
                )}
                {seconds !== undefined && (
                    <div className="countdown-item">
                        <SVGCircle radius={secondsRadius} />
                        {seconds}
                        <span>seconds</span>
                    </div>
                )}
            </div>
        </div>
    );
};

const SVGCircle = ({ radius }) => (
    <svg className="countdown-svg">
        <path fill="none" stroke="#06e906" strokeWidth="4" d={describeArc(50, 50, 48, 0, radius)} />
    </svg>
);

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    const d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(' ');

    return d;
}

function mapNumber(number, in_min, in_max, out_min, out_max) {
    return ((number - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

export default CountDown;
