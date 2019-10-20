const Code = require('@hapi/code');
const Lab = require('@hapi/lab');
const Sinon = require('sinon');

const counter = require('../lib/service/counter');
const customer = require('../lib/service/customer');

const expect = Code.expect;
const lab = exports.lab = Lab.script();
const suite = lab.suite;
const test = lab.test;

suite('service.counter', () => {
    
    test('getCounterInfo', () => {
        const emit = Sinon.stub();

        const client1 = { auth: { role: 'customer' }, emit };
        counter.getCounterInfo(null, client1, null, null);

        const client2 = { auth: { role: 'counter', id: 2 }, emit };
        counter.getCounterInfo(null, client2, null, null);

        expect(emit.callCount).to.equal(1);
        expect(emit.calledWithExactly('counterInfo', { id: 2, requestTypes: ['packages'] })).to.be.true();
    });
 
    test('serveNext', async () => {
        const emit1 = Sinon.stub();
        const emit2 = Sinon.stub();
        const db = {
            llen: Sinon.stub(),
            lpop: Sinon.stub(),
            get: Sinon.stub(),
            hset: Sinon.stub()
        };

        db.llen.onCall(0).resolves(0);
        db.llen.onCall(1).resolves(1);
        db.llen.onCall(2).resolves(3);
        db.llen.onCall(3).resolves(2);
        db.llen.onCall(4).resolves(2);

        db.lpop.onFirstCall().resolves(19);
        db.lpop.onSecondCall().resolves(4);

        db.get.onFirstCall().resolves(JSON.stringify({
            type: 'packages',
            num: '006'
        }));
        db.get.onSecondCall().resolves(JSON.stringify({
            type: 'accounts',
            num: '002'
        }));

        const client1 = { auth: { role: 'customer' }, emit: emit1 };
        await counter.serveNext(null, client1, null, null);
        
        const client2 = { auth: { role: 'counter', id: 1 }, emit: emit1 };
        await counter.serveNext(null, client2, db, null);

        const client3 = { auth: { role: 'counter', id: 3 }, emit: emit1 };
        const all = { emit: emit2 };
        await counter.serveNext(null, client3, db, all);
        await counter.serveNext(null, client3, db, all);

        expect(db.llen.callCount).to.equal(5);
        expect(db.llen.calledWithExactly('queues:accounts')).to.be.true();
        expect(db.llen.calledWithExactly('queues:packages')).to.be.true();

        expect(db.lpop.callCount).to.equal(2);
        expect(db.lpop.calledWithExactly('queues:accounts')).to.be.true();
        expect(db.lpop.calledWithExactly('queues:packages')).to.be.true();

        expect(db.get.callCount).to.equal(2);
        expect(db.get.calledWithExactly('tickets:19')).to.be.true();
        expect(db.get.calledWithExactly('tickets:4')).to.be.true();

        expect(emit1.callCount).to.equal(2);
        expect(emit1.calledWithMatch('nextClient', { counter: 3, code: 'P006' })).to.be.true();
        expect(emit1.calledWithMatch('nextClient', { counter: 3, code: 'A002' })).to.be.true();

        expect(emit2.callCount).to.equal(2);
        expect(emit2.calledWithMatch('serving', { counter: 3, code: 'P006' })).to.be.true();
        expect(emit2.calledWithMatch('serving', { counter: 3, code: 'A002' })).to.be.true();

        expect(db.hset.callCount).to.equal(2);
        expect(db.hset.calledWithExactly('serving', 3, 'P006')).to.be.true();
        expect(db.hset.calledWithExactly('serving', 3, 'A002')).to.be.true();
    });

});

suite('service.customer', () => {
    
    test('getTicket', async () => {
        const emit = Sinon.stub();
        const db = {
            incr: Sinon.stub(),
            set: Sinon.stub(),
            rpush: Sinon.stub()
        };
        db.incr.onFirstCall().resolves(5);
        db.incr.onSecondCall().resolves(2);

        const client1 = { auth: { role: 'counter', id: 2 }, emit };
        await customer.getTicket(null, client1, null, null);

        const client2 = { auth: { role: 'customer' }, emit };
        await customer.getTicket({ requestType: 'nonexistent' }, client2, null, null);
        await customer.getTicket({ requestType: 'accounts' }, client2, db, null);

        expect(emit.callCount).to.equal(1);
        expect(emit.calledWithMatch('ticketGenerated', { code: 'A002' })).to.be.true();

        expect(db.incr.callCount).to.equal(2);
        expect(db.incr.calledWithExactly('tickets:id')).to.be.true();
        expect(db.incr.calledWithExactly('queues:accounts:next')).to.be.true();

        expect(db.set.callCount).to.equal(1);
        expect(db.set.calledWith('tickets:5')).to.be.true();

        expect(db.rpush.callCount).to.equal(1);
        expect(db.rpush.calledWithExactly('queues:accounts', 5)).to.be.true();
    });

});