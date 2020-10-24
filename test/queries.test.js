'use strict';

const chaiAsPromised = require('chai-as-promised');
const chai = require('chai');

chai.should();
chai.use(chaiAsPromised);
const { expect } = chai;

//input data fixtures
const vesselData = require('./input-data/fixture-vessels');
const vesselPortCalls9485007 = require('./input-data/fixture-portcall-vessel-9485007');
const vesselPortCalls9335173 = require('./input-data/fixture-portcall-vessel-9335173');

//result data fixtures
const durationRankResult = require('./result-data/duration-rank');
const dayDelayRankResult = require('./result-data/day-delays-rank');

// starSchema
const buildStarSchema = require('../src/buildStarSchema');

//queries
const {
    top5AndLeast5PortsArrival,
    nearestRankMethodForDuration,
    nearestRankMethodForVesselDelay } = require('../src/queries');

//    

describe('queries', function () {
    let star;
    before(() => {
        const portCalls = [
            { id: 9485007, data: vesselPortCalls9485007 },
            { id: 9335173, data: vesselPortCalls9335173 },
        ];
        star = buildStarSchema(vesselData, portCalls);
    });
    it('top5 and least 5 ports arrival', function () {
        const [top5, lowest5] = top5AndLeast5PortsArrival(star);
        expect(top5).to.deep.equal([
            { port: 'JPTYO-(Tokyo)', portCalls: 6 },
            { port: 'USLAX-(Los Angeles)', portCalls: 5 },
            { port: 'USOK3-(Oakland)', portCalls: 5 },
            { port: 'TWKHH-(Kaohsiung)', portCalls: 4 },
            { port: 'JPNGO-(Nagoya, Aichi)', portCalls: 4 }
        ]);
        expect(lowest5).to.deep.equal([
            { port: 'USC84-(Charleston)', portCalls: 1 },
            { port: 'USTSA-(Savannah)', portCalls: 1 },
            { port: 'USORF-(Norfolk)', portCalls: 1 },
            { port: 'SGSIN-(Singapore)', portCalls: 1 },
            { port: 'VNVUT-(Vung Tau)', portCalls: 1 }
        ]);
    });
    it('percentile duration, no duration specified', function () {
        const durationRank = nearestRankMethodForDuration(star);
        expect(durationRank).to.deep.equal([]);
    });
    it('percentile duration (5, 20, 50, 75, 90)', function () {
        const durationRank = nearestRankMethodForDuration(star, 5, 20, 50, 75, 90);
        expect(durationRank).to.deep.equal(durationRankResult);
    });
    it('percentile duration (5, 20, 50, 75, 90)', function () {
        const durationRank = nearestRankMethodForDuration(star, 5, 20, 50, 75, 90);
        expect(durationRank).to.deep.equal(durationRankResult);
    });
    it('day delays (no percentiles specified) must throw error', function(){
        expect(()=>nearestRankMethodForVesselDelay(star)).to.throw('Illegal Argument: must specify percentiles');
    });
    it('day delays (no day delays specified) must throw error', function(){
        const dayDelays = nearestRankMethodForVesselDelay(star,  5, 50, 80);
        expect(dayDelays).to.throw('Illegal Argument: must specify days delays');
    });
    it('percentiles (5, 50, 80) for day delays for 2,7,14 days', function(){
        const dayDelays = nearestRankMethodForVesselDelay(star, 5, 50, 80);
        const dayDelayRanks = dayDelays(2,14,7);
        console.log(dayDelayRanks);
        expect(dayDelayRanks).to.deep.equal(dayDelayRankResult);
    })
});