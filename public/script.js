/**
 * Created by amitava on 04/09/16.
 */
var events = {
    BOOKING_REQUESTED: 'BOOKING_REQUESTED',
    BOOKING_ACCEPTED: 'BOOKING_ACCEPTED',
    BOOKING_REJECTED: 'BOOKING_REJECTED',
    BOOKING_END_REQUESTED: 'BOOKING_END_REQUESTED',
    BOOKING_END_CONFIRMED: 'BOOKING_END_CONFIRMED',
    CONNECTED: 'CONNECTED',
    AUTH: 'AUTH'
};

var socket = io();
var user = null;

socket.on(events.BOOKING_REQUESTED, handleBookingRequest);
socket.on(events.BOOKING_ACCEPTED, handleAccept);
socket.on(events.BOOKING_REJECTED, handleReject);
socket.on(events.BOOKING_END_REQUESTED, handleBookingEndRequest);
socket.on(events.BOOKING_END_CONFIRMED, handleBookingEndConfirm);

socket.on('message', function (m) {
    console.log(m);
})

socket.on('error', function (e) {
    console.log(e);
});

socket.on(events.AUTH, function (msg) {
    user = msg;
});

function handleBookingRequest(msg) {
    var item = $(`<li id="req_${msg._id}"></li>`).data('id', msg._id).html(`
        Request for ${msg.space.name} from ${msg.user.name}(${msg.user.email}) <button class="a">Approve</button> <button class="r">Reject</button>
    `);
    $('#requests').append(item);
}

function handleAccept(msg) {
    var $progress = $('#progress');
    $progress.append(`
        <li id="p_${msg._id}">${msg.space.name} - ${msg.user.name}(${msg.user.email})</li>
    `)
}

function handleReject(msg) {
    $(`#req_${msg._id}`).remove();
}

function handleBookingEndRequest(msg) {
    var $end = $('#end');
    $end.append(`
        <li data-id="${msg._id}" id="e_${msg._id}">${msg.space.name} - ${msg.user.name}(${msg.user.email}) <button class="c">Confirm</button></li>
    `)
}

function handleBookingEndConfirm(msg) {
    console.log(msg);
    $(`#e_${msg._id}`).remove();

}

$(function () {
    var $req = $('#requests');

    $req.on('click', 'button.a', function () {
        var $this = $(this);
        const id = $this.parent().data('id');

        $.ajax({
            url: `/api/requests/${id}/accept`,
            method: 'put',
            success: function (r) {
                console.log(r);
                $(`#req_${id}`).remove();
            }
        })
    });

    $req.on('click', 'button.r', function () {
        var $this = $(this);
        const id = $this.parent().data('id');

        $.ajax({
            url: `/api/requests/${id}/reject`,
            method: 'put',
            success: function (r) {
                console.log(r)
            }
        })
    });

    $('#end').on('click', 'button.c', function () {
        var $this = $(this);
        const id = $this.parent().data('id');

        $.ajax({
            url: `/api/requests/${id}/end`,
            method: 'put',
            success: function (r) {

            }
        })
    });


});