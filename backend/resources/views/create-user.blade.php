<!DOCTYPE html>
<html>
<head>
    <title>إضافة مستخدم جديد</title>
</head>
<body>
    <h1>إضافة مستخدم جديد</h1>

    <!-- عرض رسالة النجاح -->
    @if(session('success'))
        <div style="color:green;">
            {{ session('success') }}
        </div>
    @endif

    <form action="{{ route('users.store') }}" method="POST">
        @csrf

        <div>
            <label>الاسم:</label>
            <input type="text" name="name" value="{{ old('name') }}">
            @error('name')
                <div style="color:red">{{ $message }}</div>
            @enderror
        </div>

        <div>
            <label>الإيميل:</label>
            <input type="email" name="email" value="{{ old('email') }}">
            @error('email')
                <div style="color:red">{{ $message }}</div>
            @enderror
        </div>

        <div>
            <label>الباسورد:</label>
            <input type="password" name="password">
            @error('password')
                <div style="color:red">{{ $message }}</div>
            @enderror
        </div>

        <div>
            <label>تأكيد الباسورد:</label>
            <input type="password" name="password_confirmation">
        </div>

        <button type="submit">إضافة مستخدم</button>
    </form>
</body>
</html>