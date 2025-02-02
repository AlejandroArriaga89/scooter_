import { connectMongoDB } from "@/lib/mongodb"
import User from "@/models/user"
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req){
    try {
        const { name, email, password} = await req.json()

        const hashedPassword = await bcrypt.hash(password, 10)
        await connectMongoDB()
        await User.create({ name, email, password: hashedPassword })

        return NextResponse.json({ message: 'Usuario regisrado' }, { status: 201 })
    } catch (error) {
        return NextResponse.json({ message: 'Oops, ha ocurrido un error al registrar el usuario' }, { status: 500 })
    }
}