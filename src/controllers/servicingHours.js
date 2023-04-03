const servicingHours = require('../models/servicingHours')

exports.postServicing = (req, res, next)=>{
    const id = req.body.id
    const title = req.body.title
    const deskripsi = req.body.deskripsi

    const post = new servicingHours({
        id: id,
        title: title,
        deskripsi: deskripsi,
        data: []
    })

    post.save()
    .then(result=>{
        res.status(201).json({
            message: "servicing hours berhasil di post",
            data: result
        })
    })
    .catch(err=>console.log(err))
}

exports.postServicingData = (req, res, next)=>{
    const _id = req.params._id

    const id = `${new Date().getTime()}`
    const day = req.body.day
    const time = req.body.time

    const data = {
        id: id,
        day: day,
        time: time
    }

    servicingHours.updateOne(
        {_id: _id},
        {$push: {data: data}},
    )
    .then(result=>{
        res.status(201).json({
            message: 'data time servicing berhasil di post',
            data : result
        })
    })
    .catch(err=>console.log(err))
}

exports.postBookAnAppointment = (req, res, next)=>{
    const id = req.body.id
    
    const post = new servicingHours({
        id: id,
        diseaseType: [],
        userAppointmentData: []
    })

    post.save()
    .then(result=>{
        res.status(201).json({
            message: "book an appointment berhasil di post",
            data: result
        })
    })
    .catch(err=>console.log(err))
}

exports.postDiseaseType = (req, res,next)=>{
    const _id = req.params._id

    const jenis = req.body.jenis

    const data = {
        jenis: jenis
    }

    servicingHours.updateOne(
        {_id: _id},
        {$push: {diseaseType: data}},
        {upsert: true}
    )
    .then(result=>{
        res.status(201).json({
            message: "disease type berhasil di post",
            data: result
        })
    })
    .catch(err=>console.log(err))
}

exports.postUserAppointmentData = (req, res, next)=>{
    const _id = req.params._id

    const id = `${new Date().getTime()}`
    const patientName = req.body.patientName
    const phone = req.body.phone
    const emailAddress = req.body.emailAddress
    const dateOfBirth = req.body.dateOfBirth
    const jenisPenyakit = req.body.jenisPenyakit
    const appointmentDate = req.body.appointmentDate
    const message = req.body.message

    const data = {
        id: id,
        patientName: patientName,
        phone: phone,
        emailAddress: emailAddress,
        dateOfBirth: dateOfBirth,
        jenisPenyakit: jenisPenyakit,
        appointmentDate: appointmentDate,
        message: message,
        isConfirm: {}
    }

    servicingHours.updateOne(
        {_id: _id},
        {$push: {userAppointmentData: {$each: [data], $position: 0}}},
        {upsert: true}
    )
    .then(result=>{
        res.status(201).json({
            message: "user berhasil mengirim book an appointment",
            data: result
        })
    })
    .catch(err=>console.log(err))
}

exports.postConfirmAppointmentDate = (req, res, next)=>{
    const _id = req.params._id
    const id = req.params.id

    const newId = `${new Date().getTime()}`
    const message = req.body.message
    const emailAdmin = req.body.emailAdmin
    const dateConfirm = req.body.dateConfirm
    const nameDoctor = req.body.doctorInfo.nameDoctor
    const doctorSpecialist = req.body.doctorInfo.doctorSpecialist
    const queueNumber = req.body.queueNumber
    const roomNumber = req.body.roomInfo.roomNumber
    const roomName = req.body.roomInfo.roomName

    const data = {
        id: newId,
        message,
        emailAdmin,
        dateConfirm,
        doctorInfo: {
            nameDoctor,
            doctorSpecialist
        },
        queueNumber,
        roomInfo: {
            roomNumber,
            roomName,
        }
    }

    const updateDocument = {
        $set: { "userAppointmentData.$.isConfirm": data },
    }

    servicingHours.updateOne({ _id: _id, "userAppointmentData.id": id }, updateDocument)
        .then(result => {
            res.status(201).json({
                message: "user appointment date is confirm",
                data: result
            })
        })
        .catch(err => console.log(err))
}

exports.putServicing = (req, res, next)=>{
    const _id = req.params._id

    const title = req.body.title
    const deskripsi = req.body.deskripsi

    servicingHours.findById(_id)
    .then(post=>{
        if(!post){
            const err = new Error('data tidak ada')
            err.errorStatus = 404
            throw err
        }

        post.title = title
        post.deskripsi = deskripsi

        return post.save()
    })
    .then(result=>{
        res.status(201).json({
            message: "title dan deskripsi servicing hours berhasil di update",
            data: result
        })
    })
    .catch(err=>next(err))
}

exports.putServicingData = (req, res, next)=>{
    const _id = req.params._id
    const id = req.params.id

    const day = req.body.day
    const time = req.body.time

    const updateDocumentDay = {
        $set: {"data.$.day": day}
    }

    const updateDocumentTime = {
        $set: {"data.$.time": time}
    }

    servicingHours.updateOne({_id: _id, "data.id": id}, updateDocumentDay)
    .then(result=>{
        servicingHours.updateOne({_id: _id, "data.id": id}, updateDocumentTime)
        .then(result=>{
            res.status(201).json({
                message: "data time servicing hours berhasil di update",
                data: result
            })
        })
        return result
    })
    .catch(err=>console.log(err))
}

exports.putDiseaseType = (req, res, next)=>{
    const _id = req.params._id
    const paramsJenis = req.params.jenis

    const jenis = req.body.jenis

    const updateDocument = {
        $set: {"diseaseType.$.jenis": jenis}
    }

    servicingHours.updateOne({_id: _id, "diseaseType.jenis": paramsJenis}, updateDocument)
    .then(result=>{
        res.status(201).json({
            message: "disease type berhasil di update",
            data: result
        })
    })
    .catch(err=>console.log(err))
}

exports.getAll = (req, res, next)=>{
    let totalItems
    
    servicingHours.find()
    .countDocuments()
    .then(count=>{
        totalItems = count
        return servicingHours.find()
    })
    .then(result=>{
        res.status(200).json({
            message: "semua data di dapatkan",
            data: result,
            totalData: totalItems
        })
    })
    .catch(err=>next(err))
}