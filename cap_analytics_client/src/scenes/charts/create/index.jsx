import UploadChartForm from 'components/UploadChartForm'
import React from 'react'

const CreateCharts = () => {
  return (
   
    <div className="max-w-4xxl mx-auto p-6 shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">uploade meta data for chart</h1>
       <UploadChartForm />
    </div>
  )
}

export default CreateCharts