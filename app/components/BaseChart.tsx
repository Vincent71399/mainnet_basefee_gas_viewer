import React from 'react';


const BaseChart = (props: any) => {
    return <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden border-2 border-blue-500 p-6 shadow-lg">
        {props.children}
    </div>

}

export default BaseChart

