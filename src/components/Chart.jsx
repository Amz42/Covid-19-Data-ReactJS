import React from 'react';

function Chart({id}){
    return (
        <React.Fragment>
            {/* col-lg-8 col-md-12 col-xs-12 col-sm-12 */}
            <div className=" mt-5 mb-3" id={id} align="center">

                {/* loader */}
                <svg className="mt-5" width="200" height="200" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" stroke="#fff">
                    <g fill="none" fillRule="evenodd" strokeWidth="4">
                        <circle cx="22" cy="22" r="16.6391">
                            <animate attributeName="r" begin="0s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                            <animate attributeName="stroke-opacity" begin="0s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                        </circle>
                        <circle cx="22" cy="22" r="19.9254">
                            <animate attributeName="r" begin="-0.9s" dur="1.8s" values="1; 20" calcMode="spline" keyTimes="0; 1" keySplines="0.165, 0.84, 0.44, 1" repeatCount="indefinite"></animate>
                            <animate attributeName="stroke-opacity" begin="-0.9s" dur="1.8s" values="1; 0" calcMode="spline" keyTimes="0; 1" keySplines="0.3, 0.61, 0.355, 1" repeatCount="indefinite"></animate>
                        </circle>
                    </g>
                </svg>

                
            </div>
        </React.Fragment>
    )
}

export default Chart;