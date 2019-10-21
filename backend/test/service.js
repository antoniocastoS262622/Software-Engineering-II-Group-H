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
        const emit3 = Sinon.stub();
        const emit4 = Sinon.stub();
        const emit5 = Sinon.stub();
        const emit6 = Sinon.stub();
        const emit7 = Sinon.stub();
        const db = {
            llen: Sinon.stub(),
            lpop: Sinon.stub(),
            get: Sinon.stub(),
            hset: Sinon.stub(),
            lrange: Sinon.stub()
        };
        const all = {
            sockets: {
                'abc': {
                    auth: { role: 'customer' },
                    ticket: { id: 6, requestType: 'accounts' },
                    emit: emit3
                },
                'def': {
                    auth: { role: 'counter', id: 2 },
                    emit: emit4
                },
                'ghi': {
                    auth: { role: 'customer' },
                    ticket: { id: 26, requestType: 'packages' },
                    emit: emit5
                },
                'jkl': {
                    auth: { role: 'board' },
                    emit: emit6
                },
                'mno': {
                    auth: { role: 'customer' },
                    ticket: { id: 13, requestType: 'accounts' },
                    emit: emit7
                },
            },
            emit: emit2
        };

        db.llen.onCall(0).resolves(0);
        db.llen.onCall(1).resolves(1);
        db.llen.onCall(2).resolves(3);
        db.llen.onCall(3).resolves(2);
        db.llen.onCall(4).resolves(2);
        
        db.lrange.onFirstCall().resolves(['19', '22', '26', '27', '30']);
        db.lrange.onSecondCall().resolves(['4', '6', '7', '11', '13', '16']);
        db.lrange.onThirdCall().resolves(['4', '6', '7', '11', '13', '16']);

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

        expect(db.lrange.callCount).to.equal(3);
        expect(db.lrange.calledWithExactly('queues:packages', '0', '-1')).to.be.true();
        expect(db.lrange.calledWithExactly('queues:accounts', '0', '-1')).to.be.true();

        expect(emit1.callCount).to.equal(2);
        expect(emit1.calledWithMatch('nextClient', { counter: 3, code: 'P006' })).to.be.true();
        expect(emit1.calledWithMatch('nextClient', { counter: 3, code: 'A002' })).to.be.true();

        expect(emit2.callCount).to.equal(2);
        expect(emit2.calledWithMatch('serving', { counter: 3, code: 'P006' })).to.be.true();
        expect(emit2.calledWithMatch('serving', { counter: 3, code: 'A002' })).to.be.true();

        expect(emit3.callCount).to.equal(1);
        expect(emit3.calledWithExactly('estimatedTimeChanged', { estimatedTime: 10 })).to.be.true();

        expect(emit4.callCount).to.equal(0);

        expect(emit5.callCount).to.equal(1);
        expect(emit5.calledWithExactly('estimatedTimeChanged', { estimatedTime: 27 })).to.be.true();

        expect(emit6.callCount).to.equal(0);

        expect(emit7.callCount).to.equal(1);
        expect(emit7.calledWithExactly('estimatedTimeChanged', { estimatedTime: 25 })).to.be.true();

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
            rpush: Sinon.stub(),
            lrange: Sinon.stub()
        };
        db.incr.onFirstCall().resolves(12);
        db.incr.onSecondCall().resolves(6);
        db.lrange.onFirstCall().resolves(['9', '10', '12']);

        const client1 = { auth: { role: 'counter', id: 2 }, emit };
        await customer.getTicket(null, client1, null, null);

        const client2 = { auth: { role: 'customer' }, emit };
        await customer.getTicket({ requestType: 'nonexistent' }, client2, null, null);
        await customer.getTicket({ requestType: 'accounts' }, client2, db, null);

        expect(emit.callCount).to.equal(1);
        expect(emit.calledWithMatch('ticketGenerated', { code: 'A006', estimatedTime: 15 })).to.be.true();

        expect(db.incr.callCount).to.equal(2);
        expect(db.incr.calledWithExactly('tickets:id')).to.be.true();
        expect(db.incr.calledWithExactly('queues:accounts:next')).to.be.true();

        expect(db.lrange.callCount).to.equal(1);
        expect(db.lrange.calledWithExactly('queues:accounts', '0', '-1')).to.be.true();

        expect(db.set.callCount).to.equal(1);
        expect(db.set.calledWith('tickets:12')).to.be.true();

        expect(db.rpush.callCount).to.equal(1);
        expect(db.rpush.calledWithExactly('queues:accounts', 12)).to.be.true();
    });

});