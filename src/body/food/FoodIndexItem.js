import React, { Component } from "react";
import { connect } from "react-redux";
import { browserHistory, withRouter } from "react-router-dom";

import "../../assets/styles/FoodIndexItem.css";

class FoodIndexItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    };
  }

  // disabled condition is removed from component on a new search
  componentWillReceiveProps = () => {
    this.setState({ clicked: false });
  };

  handleNewEntry = async event => {
    const entry = {
      foodData: {
        dietaryFiber: this.props.dietaryFiber,
        foodName: this.props.foodName,
        netCarbs: this.props.netCarbs,
        servingSize: this.props.servingSize,
        servingSizeGrams: this.props.servingSizeGrams,
        totalCarbs: this.props.totalCarbs
      },
      foodEater: this.props.userId
    };
    event.preventDefault();
    const response = await fetch("http://localhost:3001/api/foodEntry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry)
    });
    const json = await response.json();
    if (response.ok) {
      console.log("New Entry Created!");
    } else {
      console.log("Failed to create new entry =[");
    }
    if (this.props.history.location.pathname === "/profile") {
      this.props.handleRefresh();
    }
    this.setState({ clicked: true });
  };

  render() {
    const {
      dietaryFiber,
      foodName,
      isKeto,
      netCarbs,
      servingSize,
      servingSizeGrams,
      totalCarbs
    } = this.props;
    let { isLoginSuccess, userId } = this.props;
    if (this.props.isLoginSuccess) {
      if (!this.state.clicked) {
        return (
          <div>
            <div className="food-idx-item">
              <b>
                {foodName} &mdash; {isKeto}
              </b>
              <p>
                Serving size: {servingSize} ({servingSizeGrams} g)
              </p>
              <p>{totalCarbs} g Total Carbs</p>
              <p>&mdash; {dietaryFiber} g Dietary Fiber</p>
              <p>= {netCarbs} g Net Carbs</p>
              <button
                type="submit"
                onClick={this.handleNewEntry}
                disabled={this.state.clicked}
              >
                Add to Profile
              </button>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <button type="submit" disabled={this.state.clicked}>
              Added {this.props.servingSize} servings of {this.props.foodName}
            </button>
          </div>
        );
      }
    } else {
      return (
        <div className="food-idx-item">
          <b>
            {foodName} &mdash; {isKeto}
          </b>
          <p>
            Serving size: {servingSize} ({servingSizeGrams} g)
          </p>
          <p>{totalCarbs} g Total Carbs</p>
          <p>&mdash; {dietaryFiber} g Dietary Fiber</p>
          <p>= {netCarbs} g Net Carbs</p>
        </div>
      );
    }
  }
}

const mapStateToProps = state => {
  return {
    isLoginSuccess: state.isLoginSuccess,
    userId: state.userId
  };
};

export default connect(mapStateToProps)(withRouter(FoodIndexItem));
