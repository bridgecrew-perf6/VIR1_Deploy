/**
 * @file     subnetHelper.test.js
 * @brief    This class is designed to test the behaviour of a Subnet.
 * @author   Mathieu Rabot
 * @version  13-06-2022 - original (dedicated to VIR1)
 */

const SubnetHelper = require("../subnet/subnetHelper.js");

let subnetHelper;

beforeEach(() => {
    subnetHelper = new SubnetHelper("eu-west-3");
})

afterEach(() => {

})