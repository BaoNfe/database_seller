import React from "react";
import SellerMenu from "../../components/Layout/SellerMenu";
import Layout from "../../components/Layout/Layout";
const SellerDashboard = () => {
  return (
    <Layout>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <SellerMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h1>YEH THIS IS SELLER</h1>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SellerDashboard;