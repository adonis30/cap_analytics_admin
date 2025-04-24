import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const url = 'api/v1/';
export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_BASE_URL, // Ensure your .env.local is configured
  }),
  reducerPath: 'api', // Use a logical path for the API reducer
  tagTypes: [
    'User',
    'Company',
    'FundingInstrument',
    'FundingRound',
    'FundingType',
    'BoardMember',
    'Investor',
    'Category',
    'Upload',

  ], // Declare all entities for tagging
  endpoints: (build) => ({
    // User Endpoints
    getUser: build.query({
      query: (id) => `${url}user/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    getAllUsers: build.query({
      query: () => `${url}user/`,
      providesTags: ['User'],
    }),

    createUser: build.mutation({
      query: (newUser) => ({
        url: `${url}user/`,
        method: 'POST',
        body: newUser,
      }),
      invalidatesTags: ['User'], 
    }),

    updateUser: build.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `${url}user/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: build.mutation({
      query: (id) => ({
        url: `${url}user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'], // Invalidate cache to refresh
    }),


    // Authentication
    signIn: build.mutation({
      query: (credentials) => ({
        url: `${url}auth/sign-in`,
        method: 'POST',
        body: credentials,
      }),
    }),


    checkAuth: build.query({
      query: () => `${url}auth/check-auth`,
      providesTags: ['User'], // You can adjust the tags as needed
    }),

 
    // CRUD for Companies
    getCompanies: build.query({
      query: () => `${url}company/`,
      providesTags: ['Company'], // Provides "Company" cache tag for all
    }),
    getCompanyById: build.query({
      query: (id) => `${url}company/${id}`,
      providesTags: (result, error, id) => [{ type: 'Company', id }],
    }),
    createCompany: build.mutation({
      query: (newCompany) => ({
        url: `${url}company/`,
        method: 'POST',
        body: newCompany,
      }),
      invalidatesTags: ['Company'], // Invalidate cache to refresh
    }),
    updateCompany: build.mutation({
      query: ({ companyId, company }) => ({
        url: `${url}company/${companyId}`,
        method: 'PUT',
        body: company, // <- Send only the company object
      }),
      invalidatesTags: (result, error, { companyId }) => [{ type: 'Company', companyId }],
    }),
    deleteCompany: build.mutation({
      query: (id) => ({
        url: `${url}company/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Company'], // Invalidate cache to refresh
    }),

    // CRUD for Funding Instruments
    getFundingInstruments: build.query({
      query: () => `${url}fundings/fundingInstruments`,
      providesTags: ['FundingInstrument'],
    }),
    getFundingInstrumentById: build.query({
      query: (id) => `${url}fundings/fundingInstruments/${id}`,
      providesTags: (result, error, id) => [{ type: 'FundingInstrument', id }],
    }),
    createFundingInstrument: build.mutation({
      query: (newInstrument) => ({
        url: `${url}fundings/fundingInstruments`,
        method: 'POST',
        body: newInstrument,
      }),
      invalidatesTags: ['FundingInstrument'],
    }),
    updateFundingInstrument: build.mutation({
      query: ({ id, ...data }) => ({
        url: `${url}fundings/fundingInstruments/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'FundingInstrument', id }],
    }),
    deleteFundingInstrument: build.mutation({
      query: (id) => ({
        url: `${url}fundings/fundingInstruments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FundingInstrument'],
    }),

    // CRUD for Funding Rounds
    getFundingRounds: build.query({
      query: () => `${url}fundings/fundingRounds`,
      providesTags: ['FundingRound'],
    }),
    getFundingRoundById: build.query({
      query: (id) => `${url}fundings/fundingRounds/${id}`,
      providesTags: (result, error, id) => [{ type: 'FundingRound', id }],
    }),
    createFundingRound: build.mutation({
      query: (newRound) => ({
        url: `${url}fundings/fundingRounds`,
        method: 'POST',
        body: newRound,
      }),
      invalidatesTags: ['FundingRound'],
    }),
    updateFundingRound: build.mutation({
      query: ({ id, ...data }) => ({
        url: `${url}fundings/fundingRounds/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'FundingRound', id }],
    }),
    deleteFundingRound: build.mutation({
      query: (id) => ({
        url: `${url}fundings/fundingRounds/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FundingRound'],
    }),

    // CRUD SDG Focus Areas
    getsdgFocus: build.query({
      query: () => `${url}sdgFocus`,
      providesTags: ['sdgFocus'],
    }),

    getsdgFocusById: build.query({
      query: (id) => `${url}sdgFocus/${id}`,
      providesTags: (result, error, id) => [{ type: 'sdgFocus', id }],
    }),
    createsdgFocus: build.mutation({
      query: (newFocus) => ({
        url: `${url}sdgFocus`,
        method: 'POST',
        body: newFocus,
      }),
      invalidatesTags: ['sdgFocus'],
    }),
    updatesdgFocus: build.mutation({
      query: ({ id, ...data }) => ({
        url: `${url}sdgFocus/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'sdgFocus', id }],
    }),
    deletesdgFocus: build.mutation({
      query: (id) => ({
        url: `${url}sdgFocus/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['sdgFocus'],
    }),



    // CRUD for Funding Types
    getFundingTypes: build.query({
      query: () => `${url}fundings/fundingTypes`,
      providesTags: ['FundingType'],
    }),
    getFundingTypeById: build.query({
      query: (id) => `${url}fundings/fundingTypes/${id}`,
      providesTags: (result, error, id) => [{ type: 'FundingType', id }],
    }),
    createFundingType: build.mutation({
      query: (newType) => ({
        url: `${url}fundings/fundingTypes`,
        method: 'POST',
        body: newType,
      }),
      invalidatesTags: ['FundingType'],
    }),
    updateFundingType: build.mutation({
      query: ({ id, ...data }) => ({
        url: `${url}fundings/fundingTypes/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'FundingType', id }],
    }),
    deleteFundingType: build.mutation({
      query: (id) => ({
        url: `${url}fundings/fundingTypes/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['FundingType'],
    }),
    // CRUD for Investors
    getInvestors: build.query({
      query: () => `${url}investors/`,
      providesTags: ['Investor'],
    }),
    getInvestorById: build.query({
      query: (id) => `${url}investors/${id}`,
      providesTags: (result, error, id) => [{ type: 'Investor', id }],
    }),
    createInvestor: build.mutation({
      query: (newInvestor) => ({
        url: `${url}investors/`,
        method: 'POST',
        body: newInvestor,
      }),
      invalidatesTags: ['Investor'],
    }),
    updateInvestor: build.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `${url}investors/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Investor', id }],
    }),
    deleteInvestor: build.mutation({
      query: (id) => ({
        url: `${url}investors/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Investor'],
    }),

    // CRUD for Board Members
    getBoardMembers: build.query({
      query: () => `${url}general/boardMembers`,
      providesTags: ['BoardMember'],
    }),
    getBoardMemberById: build.query({
      query: (id) => `${url}general/boardMembers/${id}`,
      providesTags: (result, error, id) => [{ type: 'BoardMember', id }],
    }),
    createBoardMember: build.mutation({
      query: (newMember) => ({
        url: `${url}general/boardMembers`,
        method: 'POST',
        body: newMember,
      }),
      invalidatesTags: ['BoardMember'],
    }),
    updateBoardMember: build.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `${url}general/boardMembers/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'BoardMember', id }],
    }),
    deleteBoardMember: build.mutation({
      query: (id) => ({
        url: `${url}general/boardMembers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BoardMember'],
    }),
    // Category Endpoints
    getCategories: build.query({
      query: () => `${url}categories/`,
      providesTags: ['Category'],
    }),
    getCategoryById: build.query({
      query: (id) => `${url}categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),
    createCategory: build.mutation({
      query: (newCategory) => ({
        url: `${url}categories/`,
        method: 'POST',
        body: newCategory,
      }),
      invalidatesTags: ['Category'],
    }),
    updateCategory: build.mutation({
      query: ({ id, ...updatedData }) => ({
        url: `${url}categories/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }],
    }),
    deleteCategory: build.mutation({
      query: (id) => ({
        url: `${url}categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category'],
    }),
    //Upload Endpoints
    initiateUpload: build.mutation({
      query: (formData) => ({
        url: `${url}images/upload`,
        method: 'POST',   
        body: formData,
        formData: true,
      }),
    }),
  }),
});

// Auto-generated hooks for queries and mutations
export const {
  useSignInMutation,
  useGetUserQuery,
  useCheckAuthQuery,
  useGetAllUsersQuery,
  useCreateUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useGetFundingInstrumentsQuery,
  useGetFundingInstrumentByIdQuery,
  useCreateFundingInstrumentMutation,
  useUpdateFundingInstrumentMutation,
  useDeleteFundingInstrumentMutation,
  useGetFundingRoundsQuery,
  useGetFundingRoundByIdQuery,
  useCreateFundingRoundMutation,
  useUpdateFundingRoundMutation,
  useDeleteFundingRoundMutation,
  useGetFundingTypesQuery,
  useGetFundingTypeByIdQuery,
  useCreateFundingTypeMutation,
  useUpdateFundingTypeMutation,
  useDeleteFundingTypeMutation,
  useGetBoardMembersQuery,
  useGetBoardMemberByIdQuery,
  useCreateBoardMemberMutation,
  useUpdateBoardMemberMutation,
  useDeleteBoardMemberMutation,
  useGetInvestorsQuery,
  useGetInvestorByIdQuery,
  useCreateInvestorMutation,
  useUpdateInvestorMutation,
  useDeleteInvestorMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetsdgFocusByIdQuery,
  useGetsdgFocusQuery,
  useCreatesdgFocusMutation,
  useUpdatesdgFocusMutation,
  useDeletesdgFocusMutation,
  useInitiateUploadMutation,
} = api;
