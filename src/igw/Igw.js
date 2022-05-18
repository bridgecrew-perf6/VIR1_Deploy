/**
 * @file      Igw.js
 * @brief     This class is designed to manage an aws Internet Gateway
 * @author    Mélodie Ohan
 * @version   11-05-2022 - original (dedicated to VIR1)
 */

"use strict";

const config = require('../config');
const { DescribeInternetGatewaysCommand, AttachInternetGatewayCommand, DetachInternetGatewayCommand  } = require("@aws-sdk/client-ec2");

const IgwcException = require("./IgwException");
const IgwNotFoundException = require("./IgwNotFoundException");
const IgwNotAttachedException = require("./IgwNotAttachedException");
const IgwAlreadyAttachedException = require("./IgwAlreadyAttachedException");


module.exports = class Igw {

    #client; 

    constructor() {
        this.#client = config.client;
        //this.#client = config.client;

    }

    async attach(igwName, vpcName) {
        /*if(this.#vpc.exists(VpcName) != true){
            throw new VpcNotExistException()
        }*/
        if(await this.exists(igwName)/*&& vpc != null*/){
            let igw = await this.find(igwName)
            //console.log(gateway)
            /*if(vpc["Vpcs"][0]["State"]!="available"){
                throw new VpcAlreadyAttachedException()
            }*/
            if(await this.state(igwName) == "detached"){
                const command = new AttachInternetGatewayCommand (
                    {   
                        InternetGatewayId: igw["InternetGatewayId"],
                        VpcId: "vpc-0dc6811332bf28391",//this.#vpc.VpcId(VpcName, this.#vpc),
                    }
                )
                const response = await this.#client.send(command)
                return "attached";
            }else{
                throw new IgwAlreadyAttachedException()
            }
        } else {
            throw new IgwNotFoundException()
        }
    }

    async detach(igwName){
        if(await this.exists(igwName)){
            let igw = await this.find(igwName)
            if(await this.state(igwName) == "attached"){
                let command = new DetachInternetGatewayCommand(
                    {
                        InternetGatewayId: igw["InternetGatewayId"],
                        VpcId: igw["Attachments"][0]["VpcId"]
                    }
                )
                let response = await this.#client.send(command)
                return "detached";
            }else{
                throw new IgwNotAttachedException()
            }
        }else {
            throw new IgwNotFoundException()
        }

    }




    async state(igwName){        
        let response = await this.find(igwName);
        if(response["Attachments"][0] !== undefined){
            return "attached"
        }
        return "detached"
    }

    async find(igwName) {
        var params = {
            Filters: [
                {
                    Name: "tag:Name",
                    Values: [
                        igwName,
                    ],
                },
            ],
        };

        const command = new DescribeInternetGatewaysCommand(params);
        const response = await this.#client.send(command);
        return response["InternetGateways"][0]
    }

    async exists(igwName){
        let igw = await this.find(igwName)
        if(igw !== undefined){
            return true
        }
        return false
    }

}
