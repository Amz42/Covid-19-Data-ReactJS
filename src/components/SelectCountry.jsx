import React from 'react';

function SelectCountry({countries,countrySelector}){
    return (
        <React.Fragment>
            {   countries &&    
                <div className="input-group mb-3 mt-5">
                <div className="input-group-prepend">
                    <label className="input-group-text" >Country</label>
                </div>
                <select className="custom-select" id="country-selector" onChange={countrySelector}>
                    <option defaultValue value="india">India - IN</option>
                    {countries.map(
                        obj => <option value={obj.Slug}>{obj.Country} - {obj.ISO2}</option>
                    )}
                </select>
                </div>
            }  
            {   countries===undefined &&
                <p>No Data To Display</p>
            }
        </React.Fragment>
    )
}

export default SelectCountry;