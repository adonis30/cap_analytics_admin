"use client"

import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast";
import CreateInvestorForm from "components/CreateInvestorForm";
 



const CreateInvestorPage = () => {
  const navigate = useNavigate();

   return (
    <div className="max-w-4xxl mx-auto p-6 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4">
        Create a New Investor
        </h1>
        <CreateInvestorForm />
    </div>

   );
}

export default CreateInvestorPage;


