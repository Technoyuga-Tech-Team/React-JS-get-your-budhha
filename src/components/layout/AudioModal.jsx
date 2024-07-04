import React from 'react'
import { Modal } from 'react-bootstrap'

const AudioModal = ({ activeModal, setActiveModal, aud, flag }) => {
    return (
        <Modal
            className="modal fade wt-confirm-modal"
            id="confirmGuestModal"
            show={activeModal}
            onHide={setActiveModal}
            backdrop="static"
            keyboard={false}
            size='sm'
        >
            {/* <Modal.Header>
                </Modal.Header> */}
            <Modal.Body>
                <div class="wt-confirm-pay-modal-content">
                    <div class="wt-confirm-pay-guest-area d-flex flex-column">
                        <div className='d-flex justify-content-between w-100'>
                            {/* <img src='images/wearyFace.svg' alt='emoji' /> */}
                            <h3>{flag}</h3>
                            <button type="button" class="btn-close" onClick={setActiveModal}>
                            </button>

                        </div>
                        <hr style={{ color: "#989898", marginTop: "-1px" }} />
                        {/* <h3 class="wt-confirm-pay-modal mt-4">Delete?</h3> */}
                        <audio controls style={{width:'260px'}}>
                            <source src={aud} type="audio/ogg" />
                            <source src={aud} type="audio/mpeg" />
                        </audio>
                    </div>
                </div>
                {/* <div class="d-flex flex-row justify-content-between">
                        <button type="button" class="btn btn-light mr-2" onClick={setActiveModal}>No</button>
                        <button type="button" class="btn btn-primary" onClick={handleDelete} >Yes</button>
                    </div> */}
            </Modal.Body>
        </Modal>
    )
}

export default AudioModal

