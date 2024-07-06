// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ComplianceContract {
    struct AuditRecord {
        uint recordId;
        address entity;
        string action;
        uint timestamp;
        bool compliant;
        string notes;
    }

    uint private nextRecordId = 1;
    mapping(uint => AuditRecord) public auditRecords;
    mapping(address => uint[]) public recordsByEntity;

    event AuditRecordCreated(uint recordId, address indexed entity, string action, bool compliant);

    function createAuditRecord(address entity, string memory action, bool compliant, string memory notes) public {
        uint recordId = nextRecordId++;
        auditRecords[recordId] = AuditRecord(recordId, entity, action, block.timestamp, compliant, notes);
        recordsByEntity[entity].push(recordId);
        emit AuditRecordCreated(recordId, entity, action, compliant);
    }

    function getAuditRecord(uint recordId) public view returns (AuditRecord memory) {
        return auditRecords[recordId];
    }

    function getRecordsByEntity(address entity) public view returns (uint[] memory) {
        return recordsByEntity[entity];
    }
}
