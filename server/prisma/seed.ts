import { PrismaClient, Role, UserStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@akhdar.com' },
        update: {},
        create: {
            email: 'admin@akhdar.com',
            password: adminPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: Role.ADMIN,
            status: UserStatus.ACTIVE,
        },
    });
    console.log('✅ Admin user created:', admin.email);

    // Create manager user
    const managerPassword = await bcrypt.hash('manager123', 10);
    const manager = await prisma.user.upsert({
        where: { email: 'manager@akhdar.com' },
        update: {},
        create: {
            email: 'manager@akhdar.com',
            password: managerPassword,
            firstName: 'Manager',
            lastName: 'User',
            role: Role.MANAGER,
            status: UserStatus.ACTIVE,
        },
    });
    console.log('✅ Manager user created:', manager.email);

    // Create employee user
    const employeePassword = await bcrypt.hash('employee123', 10);
    const employee = await prisma.user.upsert({
        where: { email: 'employee@akhdar.com' },
        update: {},
        create: {
            email: 'employee@akhdar.com',
            password: employeePassword,
            firstName: 'Employee',
            lastName: 'User',
            role: Role.EMPLOYEE,
            status: UserStatus.ACTIVE,
            managerId: manager.id,
        },
    });
    console.log('✅ Employee user created:', employee.email);

    // Create a department
    const department = await prisma.department.upsert({
        where: { name: 'Engineering' },
        update: {},
        create: {
            name: 'Engineering',
        },
    });
    console.log('✅ Department created:', department.name);

    // Update users with department
    await prisma.user.update({
        where: { id: manager.id },
        data: { departmentId: department.id },
    });
    await prisma.user.update({
        where: { id: employee.id },
        data: { departmentId: department.id },
    });

    console.log('\n🎉 Seeding complete!\n');
    console.log('Test Credentials:');
    console.log('┌─────────────────────────────────────────┐');
    console.log('│ Admin:    admin@akhdar.com / admin123    │');
    console.log('│ Manager:  manager@akhdar.com / manager123│');
    console.log('│ Employee: employee@akhdar.com / employee123│');
    console.log('└─────────────────────────────────────────┘');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
